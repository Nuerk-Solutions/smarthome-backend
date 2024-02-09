import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { NewLogbook, LogbookSchema } from './core/schemas/logbook.schema';
import { LogbooksRepository } from './repositories/logbooks.repository';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: NewLogbook.name,
          useFactory: () => LogbookSchema,
        },
      ],
      'logbook',
    ),
    forwardRef(() => VoucherModule),
  ],
  controllers: [LogbookController],
  providers: [LogbookService, LogbooksRepository],
  exports: [LogbookService, LogbooksRepository],
})
export class LogbookModule {}
