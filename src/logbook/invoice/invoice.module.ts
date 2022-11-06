import { forwardRef, Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookInvoice, LogbookInvoiceSchema } from '../core/schemas/logbook-invoice.schema';
import { MailModule } from '../../core/mail/mail.module';
import { StatsModule } from '../stats/stats.module';
import { LogbooksInvoiceRepository } from '../repositories/logbooksinvoice.repository';

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
    forwardRef(() => MailModule),
    StatsModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, LogbooksInvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
