import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogbookModule } from './logbook/logbook.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), LogbookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
