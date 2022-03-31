import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { GridFsMulterConfig } from './core/config/multer.config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [MulterModule.registerAsync({ useClass: GridFsMulterConfig }), NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [FileController],
  providers: [FileService, GridFsMulterConfig],
})
export class FileModule {}
