/**
 * <h1>TODO</h1>
 *  DTO is not quite right here
 */

export class FileInfo {
  readonly length: number;

  readonly chunkSize: number;

  readonly filename: string;

  readonly md5: string;

  readonly contentType: string;
}
