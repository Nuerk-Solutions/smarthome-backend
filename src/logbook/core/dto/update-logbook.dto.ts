import { IsBoolean, IsEnum, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { Driver } from '../enums/driver.enum';
import { VehicleTyp } from '../enums/vehicle-typ.enum';

export class UpdateLogbookDto {
  @IsOptional()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  // TODO: CHECK => can only be changed if it is the last logbook entry
  // TODO: Remove currentMileAge from dto and get it from the db
  @IsNotEmpty()
  @IsNumberString()
  currentMileAge: string;

  @IsEnum(VehicleTyp, { each: true, message: 'VehicleTyp is not valid' })
  vehicleTyp: VehicleTyp;

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
