import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { Logbook, LogbookSchema } from './core/schemas/logbook.schema';

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
  ],
  controllers: [LogbookController],
  providers: [LogbookService],
})
export class LogbookModule {}

// scaninfo@paloaltonetworks.com
