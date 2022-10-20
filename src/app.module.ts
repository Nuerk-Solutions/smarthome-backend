import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { LogbookModule } from './logbook/logbook.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './users/user.module';
import { MailModule } from './core/mail/mail.module';
import { FileModule } from './file/file.module';
import { YoutubeModule } from './youtube/youtube.module';
import { AppController } from './app.controller';
import { RouterModule } from '@nestjs/core';
import { StatsModule } from './logbook/stats/stats.module';
import { InvoiceModule } from './logbook/invoice/invoice.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', 'sendgrid.env'],
    }),

    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     url: configService.get('REDIS_URL'),
    //     // redis://user:pass@host:6379/0
    //   }),
    //   inject: [ConfigService],
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   connectionName: 'files',
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MULTER_MONGO_DB'),
    //   }),
    //   inject: [ConfigService],
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   connectionName: 'youtube',
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI_YOUTUBE'),
    //   }),
    //   inject: [ConfigService],
    // }),
    LogbookModule,
    RouterModule.register([
      {
        path: 'logbook',
        module: LogbookModule,
        children: [
          {
            path: 'stats',
            module: StatsModule,
          },
          {
            path: 'invoice',
            module: InvoiceModule,
          },
        ],
      },
    ]),
    StatsModule,
    InvoiceModule,
    // UserModule,
    AuthenticationModule,
    MailModule,
    // FileModule,
    // YoutubeModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
