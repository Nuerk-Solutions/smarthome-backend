import { IsBoolean, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { Driver } from '../enums/driver.enum';

export class UpdateLogbookDto {
  @IsOptional()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  @IsOptional()
  @IsNumberString()
  newMileAge: string;

  @IsOptional()
  @IsBoolean()
  forFree: boolean = false;

  @IsOptional()
  driveReason: string;

  @IsOptional()
  additionalInformation: string;

  @IsOptional()
  additionalInformationCost: string;
}
