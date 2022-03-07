import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Db, GridFSBucketReadStream } from 'mongodb';
import { FileInfo } from './core/dto/file-info.dto';
import { FileNotFoundException } from './core/exceptions/file-not-found.exception';
import { Connection } from 'mongoose';

export interface MongooseConnectionInstance {
  db: Db;
}

@Injectable()
export class FileService {
  private readonly _fileModel: MongoGridFS;

  // Inject the connection to the right database
  constructor(
    @InjectConnection('files')
    private readonly _connection: MongooseConnectionInstance & Connection,
  ) {
    this._fileModel = new MongoGridFS(this._connection.db, 'fs');
  }

  /**
   * Get a {@link GridFSBucketReadStream} by open a {@link openDownloadStream}.
   * @param id The id of the file to get.
   * @returns {@link GridFSBucketReadStream}
   */
  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this._fileModel.readFileStream(id);
  }

  /**
   * Get the {@link FileInfo}
   * @param id The id of the file to get.
   * @returns The {@link FileInfo}
   */
  async findInfo(id: string): Promise<FileInfo> {
    const result = await this._fileModel
      .findById(id)
      .then((file) => file)
      .catch((error) => {
        throw new FileNotFoundException(error);
      });
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
  }

  /**
   * Delete a file by id.
   * @param id The id of the file to delete.
   * @returns The success of the deletion.
   */
  async deleteFile(id: string): Promise<boolean> {
    return await this._fileModel.delete(id);
  }
}
