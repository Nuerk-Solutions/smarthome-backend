import { IsDateString, IsEnum, IsISO8601, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { Driver } from '../enums/driver.enum';
import { VehicleTyp } from '../enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../enums/additional-information-typ.enum';

export class CreateLogbookDto {
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  @IsEnum(VehicleTyp, { each: true, message: 'VehicleTyp is not valid' })
  vehicleTyp: VehicleTyp;

  @IsNotEmpty()
  @IsNumberString()
  currentMileAge: string;

  @IsNotEmpty()
  @IsNumberString()
  newMileAge: string;

  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  driveReason: string;

  @IsEnum(AdditionalInformationTyp, {
    each: true,
    message: 'AdditionalInformationTyp is not valid',
  })
  additionalInformationTyp: AdditionalInformationTyp;

  @IsOptional()
  additionalInformation = '';

  @IsOptional()
  additionalInformationCost = '';
}
