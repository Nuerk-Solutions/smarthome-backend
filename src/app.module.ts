import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { LogbookModule } from './logbook/logbook.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './core/mail/mail.module';
import { RouterModule } from '@nestjs/core';
import { StatsModule } from './logbook/stats/stats.module';
import { InvoiceModule } from './logbook/invoice/invoice.module';
import { DatabaseModule } from './database/database.module';
import { VoucherModule } from './logbook/voucher/voucher.module';

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
          {
            path: 'voucher',
            module: VoucherModule,
          },
        ],
      },
    ]),
    StatsModule,
    InvoiceModule,
    DatabaseModule,
    AuthenticationModule,
    MailModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
