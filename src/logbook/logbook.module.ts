import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { Logbook, LogbookSchema } from './core/schemas/logbook.schema';
import { MailModule } from '../core/mail/mail.module';
import { LogbookInvoice, LogbookInvoiceSchema } from './core/schemas/logbook-invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: Logbook.name,
          useFactory: () => LogbookSchema,
        },
      ],
      'logbook',
    ),
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
  ],
  controllers: [LogbookController],
  providers: [LogbookService],
})
export class LogbookModule {}

// scaninfo@paloaltonetworks.com
