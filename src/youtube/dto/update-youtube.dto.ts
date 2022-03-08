import { PartialType } from '@nestjs/mapped-types';
import { CreateYoutubeDto } from './create-youtube.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateYoutubeDto  {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly hwid: String;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly videoDownloads: Number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly videoDownloadLength: Number;
}
