import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export function databaseConnectionOptions(configService: ConfigService) {
        const live = configService.get<string>('MONGODB_URI');
        const test = configService.get<string>('MONGODB_TEST_URI');
        if (configService.get<string>('NODE_ENV') === 'test') {
          // Tests delete fixtures. Never allow the application database as their target.
          const target = test ? new URL(test) : null;
          const liveTarget = live ? new URL(live) : null;
          if (!target || !target.pathname.replace('/', '').match(/test/i) ||
              (target.host === liveTarget?.host && target.pathname === liveTarget?.pathname)) {
            throw new Error('Integration tests require a separate MongoDB database with test in its name');
          }
        }
        return { uri: configService.get<string>('NODE_ENV') === 'test' ? test : live };
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'logbook',
      useFactory: databaseConnectionOptions,
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
