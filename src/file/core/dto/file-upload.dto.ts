import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class FileUploadDto {
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  file: FileSystemStoredFile | MemoryStoredFile;
}
