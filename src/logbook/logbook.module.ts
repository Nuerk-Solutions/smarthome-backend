import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { NewLogbook, LogbookSchema } from './core/schemas/logbook.schema';
import { LogbooksRepository } from './repositories/logbooks.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: NewLogbook.name,
          useFactory: () => LogbookSchema,
        },
        {
          name: NewLogbook.name,
          useFactory: () => LogbookSchema,
        },
      ],
      'logbook',
    ),
    // forwardRef(() => StatsModule),
    // forwardRef(() => InvoiceModule),
  ],
  controllers: [LogbookController],
  providers: [LogbookService, LogbooksRepository, LogbooksRepository],
  exports: [LogbookService],
})
export class LogbookModule {}
