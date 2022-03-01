import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GridFsMulterConfig implements MulterOptionsFactory {
  gridFsStorage;

  constructor(private readonly configService: ConfigService) {
    this.gridFsStorage = new GridFsStorage({
      url: configService.get<string>('MULTER_MONGO_DB'),
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = file.originalname.trim();
          const fileInfo = {
            filename: filename,
          };
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}
