import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogbookModule } from './logbook/logbook.module';

@Module({
  imports: [LogbookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
