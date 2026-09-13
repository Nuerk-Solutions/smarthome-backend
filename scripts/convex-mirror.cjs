// Run after `npm run build`. Uses only existing project dependencies.
require('dotenv').config({ path: '.env.development', quiet: true });
require('dotenv').config({ path: '.env.convex-mirror', quiet: true });
const { mongo } = require('mongoose');
const { LegacyMirrorWorker } = require('../dist/logbook/convex-sync/worker');
(async () => {
  const client = new mongo.MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const worker = new LegacyMirrorWorker(client.db(), {
      url: process.env.CONVEX_MIRROR_URL,
      secret: process.env.CONVEX_MIRROR_SECRET ?? '',
      mapping: JSON.parse(process.env.CONVEX_MIRROR_MAPPING ?? '{}'),
    });
    process.once('SIGINT', () => void worker.stop());
    process.once('SIGTERM', () => void worker.stop());
    const result = await worker.run(!process.argv.includes('--watch'));
    console.log(JSON.stringify(result));
  } finally { await client.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
