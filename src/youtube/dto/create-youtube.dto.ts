import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UpdateYoutubeDto } from './update-youtube.dto';

export class CreateYoutubeDto extends PartialType(UpdateYoutubeDto) {
  @IsString()
  @IsNotEmpty()
  private readonly username: String;

  @IsBoolean()
  @IsNotEmpty()
  private readonly enabled: boolean;

  @IsOptional()
  @IsDateString()
  private readonly expiryDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  private readonly systemBind: boolean;
}
