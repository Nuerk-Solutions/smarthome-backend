import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { ConfigService } from '@nestjs/config';

type GridFsStorage = InstanceType<typeof GridFsStorage>;

@Injectable()
export class GridFsMulterConfig implements MulterOptionsFactory {
  gridFsStorage: GridFsStorage;

  constructor(private readonly configService: ConfigService) {
    this.gridFsStorage = new GridFsStorage({
      url: configService.get<string>('MULTER_MONGO_DB'),
      file: (req, file) => {
        // Trim the file name to avoid path traversal
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
