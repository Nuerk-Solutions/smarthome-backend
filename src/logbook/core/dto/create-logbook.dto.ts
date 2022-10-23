import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Driver } from '../enums/driver.enum';
import { VehicleTyp } from '../enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../enums/additional-information-typ.enum';
import { IsNotBlank } from '../validation/decorators/IsNotBlank';
import { IsLowerThan } from '../validation/decorators/IsLowerThan';
import { IsGreaterThan } from '../validation/decorators/IsGreaterThan';

export class CreateLogbookDto {
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  @IsEnum(VehicleTyp, { each: true, message: 'VehicleTyp is not valid' })
  vehicleTyp: VehicleTyp;

  @IsNotEmpty()
  @IsNumberString()
  @IsLowerThan('newMileAge', { message: 'CurrentMileAge must be lower than newMileAge' })
  currentMileAge: string;

  @IsNotEmpty()
  @IsNumberString()
  @IsGreaterThan('currentMileAge', { message: 'NewMileAge must be greater than currentMileAge' })
  newMileAge: string;

  @IsNotEmpty()
  @IsBoolean()
  forFree: boolean = false;

  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  @IsNotBlank(null, { message: 'driveReason must be a string containing at least one alphabetic character' })
  driveReason: string;

  @IsEnum(AdditionalInformationTyp, {
    each: true,
    message: 'AdditionalInformationTyp is not valid',
  })
  additionalInformationTyp: AdditionalInformationTyp;

  @IsOptional()
  @IsNotBlank('additionalInformationTyp', {
    message: 'additionalInformation must be a string containing at least one alphabetic character',
  })
  additionalInformation: string = '';

  @IsOptional()
  @IsNotBlank('additionalInformationTyp', {
    message: 'additionalInformationCost must be a string containing at least one alphabetic character',
  })
  additionalInformationCost: string = '';
}
