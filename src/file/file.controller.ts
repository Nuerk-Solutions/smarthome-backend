import { Controller, Get, Param, Post, Res, StreamableFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileResponse } from './core/dto/file-response.dto';
import { RetrieveFileException } from './core/exceptions/retrieve-file.exception';

@Controller('file')
export class FileController {
  constructor(private readonly _filesService: FileService) {}

  @UseInterceptors(FilesInterceptor('file'))
  @Post()
  upload(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        id: file.id,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Get('info/:id')
  async getFileInfo(@Param('id') id: string): Promise<FileResponse> {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.readStream(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    return {
      file: file,
    };
  }

  /* Music streaming see
   * https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
   * use
   * res.header('accept-ranges', 'bytes');
   */
  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res): Promise<StreamableFile> {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.readStream(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.readStream(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    // This header sends the file size to the browser. Based on that the browser calculate the progress.
    res.header('Content-Length', file.length);
    return filestream.pipe(res);
  }

  @Get('delete/:id')
  async deleteFile(@Param('id') id: string): Promise<FileResponse> {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.deleteFile(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    return {
      file: file,
    };
  }
}
