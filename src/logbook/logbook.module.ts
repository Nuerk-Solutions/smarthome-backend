import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { Logbook, LogbookSchema } from './core/schemas/logbook.schema';
import { LogbooksRepository } from './repositories/logbooks.repository';
import {LogbookRepository} from "./repositories/logbook.repository";
import {Logbook, LogbookSchema} from "./core/schemas/logbook.schema";

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: Logbook.name,
          useFactory: () => LogbookSchema,
        },
        {
          name: Logbook.name,
          useFactory: () => LogbookSchema,
        },
      ],
      'logbook',
    ),
    // forwardRef(() => StatsModule),
    // forwardRef(() => InvoiceModule),
  ],
  controllers: [LogbookController],
  providers: [LogbookService, LogbooksRepository, LogbookRepository],
  exports: [LogbookService],
})
export class LogbookModule {}
