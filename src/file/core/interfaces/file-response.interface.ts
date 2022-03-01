import { FileInfo } from './file-info.interface';

export interface FileResponse {
  readonly file: FileInfo;
  readonly message: string;
}
