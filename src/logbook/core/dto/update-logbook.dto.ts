import { IsEnum, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { Driver } from '../enums/driver.enum';

export class UpdateLogbookDto {

  @IsOptional()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  // TODO: Add safety check for update task. Currently only managed with UI lock
  @IsNotEmpty()
  @IsNumberString()
  currentMileAge: string;

  @IsOptional()
  @IsNumberString()
  newMileAge: string;

  @IsOptional()
  driveReason: string;
}
