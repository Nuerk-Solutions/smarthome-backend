import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { Logbook, LogbookSchema } from './core/schemas/logbook.schema';
import { LogbooksRepository } from './repositories/logbooks.repository';
import {NewLogbookRepository} from "./repositories/newLogbook.repository";
import {NewLogbook, NewLogbookSchema} from "./core/schemas/newLogbook.schema";

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: Logbook.name,
          useFactory: () => LogbookSchema,
        },
        {
          name: NewLogbook.name,
          useFactory: () => NewLogbookSchema,
        },
      ],
      'logbook',
    ),
    // forwardRef(() => StatsModule),
    // forwardRef(() => InvoiceModule),
  ],
  controllers: [LogbookController],
  providers: [LogbookService, LogbooksRepository, NewLogbookRepository],
  exports: [LogbookService],
})
export class LogbookModule {}
