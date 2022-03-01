import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { FileInfo } from './core/dto/file-info.dto';
import { FileNotFoundException } from './core/exceptions/file-not-found.exception';
import { Connection } from 'mongoose';

@Injectable()
export class FileService {
  private readonly _fileModel: MongoGridFS;

  constructor(@InjectConnection('files') private readonly _connection: Connection) {
    this._fileModel = new MongoGridFS(this._connection.db, 'fs');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this._fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfo> {
    const result = await this._fileModel
      .findById(id)
      .catch((error) => {
        throw new FileNotFoundException(error);
      })
      .then((file) => file);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this._fileModel.delete(id);
  }
}
