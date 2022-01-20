import { IsDateString, IsEnum, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export enum VehicleTyp {
  FERRARI = 'Ferrari',
  VW = 'VW',
}

export enum AdditionalInformationTyp {
  KEINE = 'Keine',
  GETANKT = 'Getankt',
  GEWARTET = 'Gewartet',
}

export enum Driver {
  'Andrea',
  'Claudia',
  'Oliver',
  'Thomas',
}

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

  // distance: string;
  // distanceCost: string;

  @IsNotEmpty()
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
  additionalInformation: string;

  @IsOptional()
  @IsNumberString()
  additionalInformationCost: string;

  // distanceSinceLastAdditionalInformation: string;
}
