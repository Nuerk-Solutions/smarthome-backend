import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { LogbookModule } from './logbook/logbook.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './core/mail/mail.module';
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
    AuthenticationModule,
    MailModule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
