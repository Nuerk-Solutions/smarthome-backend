import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { Logbook, LogbookSchema } from './schemas/logbook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logbook.name, schema: LogbookSchema }]),
  ],
  controllers: [LogbookController],
  providers: [LogbookService],
})
export class LogbookModule {}
