import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfig } from './core/config/multer.config';

@Module({
  imports: [MulterModule.registerAsync({ useClass: GridFsMulterConfig })],
  controllers: [FileController],
  providers: [FileService, GridFsMulterConfig],
})
export class FileModule {}
