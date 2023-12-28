import {IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateNested} from 'class-validator';
import { Driver } from '../enums/driver.enum';
import {IsGreaterThan} from "../validation/decorators/IsGreaterThan";
import {Unit} from "../enums/unit.enum";
import {Type} from "class-transformer";
import {Details, Refuel, Service} from "../schemas/logbook.schema";
import {IsNotBlank} from "../validation/decorators/IsNotBlank";

class MileAge {
  @IsNotEmpty()
  @IsNumberString()
  @IsGreaterThan('current', {message: 'new must be greater than current mileage'})
  new: number;

  @IsNotEmpty()
  @IsEnum(Unit, {message: 'Unit is not valid'})
  readonly unit: Unit;
}

export class UpdateLogbookDto {
  @IsOptional()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  @IsNotEmpty()
  @Type(() => MileAge)
  @ValidateNested()
  readonly mileAge: MileAge;

  @IsNotEmpty()
  @Type(() => Details)
  @ValidateNested()
  readonly details: Details;

  @IsNotEmpty()
  @IsString()
  @IsNotBlank(null, {message: 'reason must be a string containing at least one alphabetic character'})
  reason: string;

  @IsOptional()
  @Type(() => Refuel)
  @ValidateNested()
  readonly refuel?: Refuel;

  @Type(() => Service)
  @ValidateNested()
  readonly service?: Service;
}
