import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookInvoice, LogbookInvoiceSchema } from '../core/schemas/logbook-invoice.schema';
import { StatsModule } from '../stats/stats.module';
import { LogbooksInvoiceRepository } from '../repositories/logbooksinvoice.repository';
import { MailModule } from '../../core/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: LogbookInvoice.name,
          useFactory: () => LogbookInvoiceSchema,
        },
      ],
      'logbook',
    ),
    StatsModule,
    MailModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, LogbooksInvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
