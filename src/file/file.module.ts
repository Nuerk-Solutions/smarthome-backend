import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';

@Module({
  imports: [MulterModule.registerAsync({ useClass: GridFsMulterConfigService })],
  controllers: [FileController],
  providers: [FileService, GridFsMulterConfigService],
})
export class FileModule {}
