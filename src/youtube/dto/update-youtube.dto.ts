import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateYoutubeDto {
  @IsString()
  @IsOptional()
  readonly hwid: String;

  @IsNumber()
  @IsOptional()
  readonly videoDownloads: Number;

  @IsNumber()
  @IsOptional()
  readonly videoDownloadLength: Number;
}
