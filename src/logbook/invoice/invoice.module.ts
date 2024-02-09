import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookInvoice, LogbookInvoiceSchema } from '../core/schemas/logbook-invoice.schema';
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
    StatsModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, LogbooksInvoiceRepository],
  exports: [InvoiceService],
})
export class InvoiceModule {}
