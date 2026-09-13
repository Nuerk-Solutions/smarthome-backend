import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { LegacyMirrorWorker } from './worker';

@Injectable()
export class ConvexSyncService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(ConvexSyncService.name);
  private worker?: LegacyMirrorWorker;
  private running?: Promise<unknown>;
  constructor(@InjectConnection('logbook') private connection: Connection, private config: ConfigService) {}

  onApplicationBootstrap() {
    if (this.config.get('CONVEX_MIRROR_ENABLED') !== 'true' || this.config.get('NODE_ENV') === 'test') return;
    try {
      this.worker = new LegacyMirrorWorker(this.connection.db, {
        url: this.config.getOrThrow<string>('CONVEX_MIRROR_URL'),
        secret: this.config.getOrThrow<string>('CONVEX_MIRROR_SECRET'),
        mapping: JSON.parse(this.config.getOrThrow<string>('CONVEX_MIRROR_MAPPING')),
      }, message => this.logger.log(message));
      this.running = this.worker.run().catch(error => this.logger.error(`Mirror stopped: ${error.message}`));
    } catch (error) { this.logger.error(`Mirror configuration rejected: ${error.message}`); }
  }

  async onApplicationShutdown() {
    await this.worker?.stop();
    await this.running;
  }
}
