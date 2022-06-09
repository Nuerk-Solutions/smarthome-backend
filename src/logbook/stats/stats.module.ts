import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { LogbookService } from '../logbook.service';
import { LogbookModule } from '../logbook.module';

@Module({
  imports: [LogbookModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {
}
