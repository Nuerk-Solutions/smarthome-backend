import { randomUUID } from 'node:crypto';
import { mongo } from 'mongoose';
import { fingerprint, mapEntry, MirrorMapping } from './mapper';

type Receipt = { _id: string; hash: string };
export type MirrorConfig = { url: string; secret: string; mapping: MirrorMapping };

export class LegacyMirrorWorker {
  private stopped = false;
  private stream?: mongo.ChangeStream;
  private readonly source: mongo.Collection;
  private readonly receipts: mongo.Collection<Receipt>;
  private readonly control: mongo.Collection<any>;
  private readonly instance = randomUUID();
  private leaseTimer?: ReturnType<typeof setInterval>;
  private leaseLost = false;
  public stats = { scanned: 0, sent: 0, deleted: 0, requests: 0 };

  constructor(private db: mongo.Db, private config: MirrorConfig, private log: (message: string) => void = console.log) {
    const url = new URL(config.url);
    // Since 2026-11-02 the mirror feeds only production ARB 19; the test deployment is no longer a target.
    if (url.href !== 'https://flexible-deer-25.eu-west-1.convex.site/legacy-mirror' || config.secret.length < 32 || !config.mapping.organizationId) {
      throw new Error('Invalid mirror configuration');
    }
    this.source = db.collection('newlogbooks');
    // Each destination has its own acknowledgements. No source document is modified.
    this.receipts = db.collection(`convex_mirror_${config.mapping.organizationId}`);
    this.control = db.collection('convex_mirror_control');
  }

  async stop() {
    this.stopped = true;
    await this.stream?.close();
  }

  private async acquireLease() {
    try {
      const now = new Date();
      const result = await this.control.findOneAndUpdate({
        _id: this.config.mapping.organizationId,
        $or: [{ leaseUntil: { $lt: now } }, { owner: this.instance }, { leaseUntil: { $exists: false } }],
      }, { $set: { owner: this.instance, leaseUntil: new Date(Date.now() + 120_000) } }, { upsert: true, returnDocument: 'after' });
      if (result.owner !== this.instance) throw new Error('Mirror already running');
    } catch (error) {
      if (error.code === 11000) throw new Error('Another mirror worker holds the lease');
      throw error;
    }
    this.leaseTimer = setInterval(() => {
      void this.control.updateOne({ _id: this.config.mapping.organizationId, owner: this.instance },
        { $set: { leaseUntil: new Date(Date.now() + 120_000) } }).then(result => {
          if (!result.matchedCount) this.leaseLost = true;
        }).catch(() => { this.leaseLost = true; });
    }, 20_000);
  }

  private assertRunning() {
    if (this.stopped || this.leaseLost) throw new Error('Mirror stopped or lease lost');
  }

  private async post(entries: ReturnType<typeof mapEntry>[], deletedSourceIds: string[]) {
    this.assertRunning();
    if (!entries.length && !deletedSourceIds.length) return;
    const response = await fetch(this.config.url, {
      method: 'POST', headers: { authorization: `Bearer ${this.config.secret}`, 'content-type': 'application/json' },
      body: JSON.stringify({ entries, deletedSourceIds }), signal: AbortSignal.timeout(20_000),
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`Convex mirror HTTP ${response.status}; batch remains unacknowledged`);
    const result = await response.json() as { imported?: unknown; deleted?: number };
    if (!Object.prototype.hasOwnProperty.call(result, 'imported') || typeof result.deleted !== 'number') throw new Error('Invalid mirror acknowledgement');
    this.stats.requests++;
    this.stats.sent += entries.length;
    this.stats.deleted += deletedSourceIds.length;
    this.log(`Convex mirror: acknowledged ${entries.length} entries, ${deletedSourceIds.length} deletions`);
  }

  // Acknowledge in MongoDB only after the entire Convex transaction succeeds.
  // A crash in between replays stable IDs and cannot duplicate imported rows.
  async syncDocuments(documents: any[]) {
    this.assertRunning();
    const entries = documents.map(document => mapEntry(document, this.config.mapping));
    const previous = await this.receipts.find({ _id: { $in: entries.map(e => e.sourceId) } }).toArray();
    const hashes = new Map(previous.map(r => [r._id, r.hash]));
    const changed = entries.filter(e => hashes.get(e.sourceId) !== fingerprint(e));
    if (!changed.length) return;
    await this.post(changed, []);
    await this.receipts.bulkWrite(changed.map(entry => ({ replaceOne: {
      filter: { _id: entry.sourceId }, replacement: { _id: entry.sourceId, hash: fingerprint(entry) }, upsert: true,
    } })));
  }

  private async deleteSources(ids: string[]) {
    if (!ids.length) return;
    await this.post([], ids);
    await this.receipts.deleteMany({ _id: { $in: ids } });
  }

  private async reconcile() {
    this.log('Convex mirror: checking source against durable acknowledgements');
    // Chronological initial import keeps odometer predecessor chains stable.
    const cursor = this.source.find({}).sort({ date: 1, _id: 1 }).batchSize(50);
    let batch: any[] = [];
    try {
      for await (const document of cursor) {
        this.assertRunning();
        this.stats.scanned++;
        batch.push(document);
        if (batch.length === 50) { await this.syncDocuments(batch); batch = []; }
      }
      if (batch.length) await this.syncDocuments(batch);
    } finally { await cursor.close(); }
    const receipts = this.receipts.find({}).batchSize(50);
    let ids: string[] = [];
    const removeMissing = async () => {
      const found = await this.source.find({ _id: { $in: ids.map(id => new mongo.ObjectId(id)) } }, { projection: { _id: 1 } }).toArray();
      const present = new Set(found.map(row => String(row._id)));
      await this.deleteSources(ids.filter(id => !present.has(id)));
      ids = [];
    };
    try {
      for await (const receipt of receipts) {
        this.assertRunning();
        ids.push(receipt._id);
        if (ids.length === 50) await removeMissing();
      }
      if (ids.length) await removeMissing();
    } finally { await receipts.close(); }
    this.log(`Convex mirror: reconciliation complete ${JSON.stringify(this.stats)}`);
  }

  private async watch(resume: any) {
    this.stream = this.source.watch([], { fullDocument: 'updateLookup', maxAwaitTimeMS: 1000, batchSize: 50, ...resume });
    let lastCheckpoint = Date.now();
    while (!this.stopped) {
      this.assertRunning();
      const ids = new Set<string>();
      const deadline = Date.now() + 2000;
      do {
        const change = await this.stream.tryNext();
        if (change) {
          if (!['insert', 'update', 'replace', 'delete'].includes(change.operationType) || !('documentKey' in change)) {
            throw new Error('Source collection changed; reconciliation required');
          }
          ids.add(String(change.documentKey._id));
        }
      } while (!this.stopped && ids.size < 50 && Date.now() < deadline);
      if (ids.size) {
        // Read current state once per group; coalesce edits and derived-field updates.
        const documents = await this.source.find({ _id: { $in: [...ids].map(id => new mongo.ObjectId(id)) } }).toArray();
        await this.syncDocuments(documents);
        const present = new Set(documents.map(row => String(row._id)));
        await this.deleteSources([...ids].filter(id => !present.has(id)));
      }
      // The token advances only AFTER data and acknowledgement writes succeeded.
      if (this.stream.resumeToken && (ids.size || Date.now() - lastCheckpoint >= 30_000)) {
        await this.control.updateOne({ _id: this.config.mapping.organizationId, owner: this.instance },
          { $set: { resumeToken: this.stream.resumeToken }, $unset: { operationTime: '' } });
        lastCheckpoint = Date.now();
      }
    }
  }

  async run(once = false) {
    while (!this.stopped) {
      try { await this.acquireLease(); break; }
      catch (error) {
        if (once) throw error;
        this.log('Convex mirror: waiting for MongoDB or previous worker lease');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    if (this.stopped) return this.stats;
    try {
      let state = await this.control.findOne({ _id: this.config.mapping.organizationId });
      let attempts = 0;
      do {
        try {
          let resume = state?.resumeToken ? { resumeAfter: state.resumeToken } : null;
          if (!resume || once) {
            // Establish the stream boundary BEFORE the snapshot, preventing a handover gap.
            const hello = await this.db.command({ hello: 1 });
            const operationTime = hello.operationTime ?? hello.$clusterTime?.clusterTime;
            if (!operationTime) throw new Error('MongoDB change streams require a replica set');
            await this.reconcile();
            resume = { startAtOperationTime: operationTime } as any;
          }
          if (once) return this.stats;
          this.log('Convex mirror: listening for MongoDB changes');
          await this.watch(resume);
        } catch (error) {
          if (this.stopped) break;
          if (this.leaseLost || once) throw error;
          // No credentials or raw documents in logs. Reconcile repairs even expired oplogs.
          this.log(`Convex mirror: ${error.message}; retrying with source reconciliation`);
          await this.stream?.close().catch(() => {});
          state = null;
          await new Promise(resolve => setTimeout(resolve, Math.min(60_000, 2000 * 2 ** Math.min(attempts++, 5))));
        }
      } while (!this.stopped);
      return this.stats;
    } finally {
      clearInterval(this.leaseTimer);
      await this.stream?.close();
      await this.control.updateOne({ _id: this.config.mapping.organizationId, owner: this.instance },
        { $unset: { owner: '', leaseUntil: '' } });
    }
  }
}
