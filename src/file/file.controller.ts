import { BadRequestException, Body, Controller, Get, Param, Post, Res, StreamableFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResponse } from './core/dto/file-response.dto';
import { RetrieveFileException } from './core/exceptions/retrieve-file.exception';
import { FileSystemStoredFile, FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { FileUploadDto } from './core/dto/file-upload.dto';
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadOptions, UploadResponse } from '@google-cloud/storage/build/src/bucket';
import { FilesInterceptor } from '@nestjs/platform-express';

/**
 * <h1>File Controller</h1>
 * This controller contains all the endpoints related to the file management
 *
 * @class FileController
 */
@Controller('file')
export class FileController {
  constructor(private readonly _filesService: FileService) {}

  /**
   * <h2>Upload File</h2>
   * This endpoint allows to upload a file
   * @param files The files to upload
   */
  @UseInterceptors(FilesInterceptor('file'))
  @Post()
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    const response = [];
    // Return all infos we can get from the file
    files.forEach((file) => {
      const fileResponse = {
        originalname: file.originalname,
        encoding: file.encoding, // Deprecated but anyway it's useful
        mimetype: file.mimetype,
        filename: file.filename,
        size: file.size,
        destination: file.destination,
        path: file.path,
        fieldname: file.fieldname,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Post('firebase')
  @FormDataRequest()
  async uploadFirebase(@Body() file: FileUploadDto): Promise<void | UploadResponse> {
    // TODO:
    //  Return download url
    //  Separate into service

    const storageRef: Bucket = getStorage().bucket('gs://logbookbackend.appspot.com');
    const options: UploadOptions = {
      public: true,
      destination: `/upload/${file.file.originalName}`,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    };

    if (file.file instanceof FileSystemStoredFile) {
      return await storageRef.upload(file.file.path, options);
    } else if (file.file instanceof MemoryStoredFile) {
      return await storageRef.file(file.file.originalName).save(file.file.buffer, options);
    } else {
      throw new BadRequestException('Wrong stored file type provided', file.file);
    }
  }

  /**
   * <h2>Retrieve fileinfos</h2>
   * This endpoint allows to retrieve the information about the file
   * @param id The id of the file
   */
  @Get('info/:id')
  async getFileInfo(@Param('id') id: string): Promise<FileResponse> {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.readStream(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    return {
      file,
    };
  }

  /* Music streaming see
   * https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
   * use
   * res.header('accept-ranges', 'bytes');
   */
  /**
   * <h2>Stream file</h2>
   * This endpoint allows to stream the file.
   * It also sets the content-type to the file's one
   * <p>Cautions: The file is streamed, not downloaded.</p>
   * @param id The id of the file
   * @param res The response as a {@link StreamableFile}
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

  /**
   * <h2>Download file</h2>
   * This endpoint allows to download the file.
   * It also sets the content-type and the content-length to the file's one
   * @param id The id of the file
   * @param res The response as a {@link StreamableFile}
   */
  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res): Promise<StreamableFile> {
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

  /**
   * <h2>Delete file</h2>
   * This endpoint allows to delete the file.
   * @param id The id of the file
   */
  @Get('delete/:id')
  async deleteFile(@Param('id') id: string): Promise<FileResponse> {
    const file = await this._filesService.findInfo(id);
    const filestream = await this._filesService.deleteFile(id);
    if (!filestream) {
      throw new RetrieveFileException();
    }
    return {
      file,
    };
  }
}
