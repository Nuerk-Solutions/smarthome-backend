import { FileInfo } from './file-info.dto';

export interface FileResponse {
  readonly file: FileInfo;
  readonly message: string;
}
