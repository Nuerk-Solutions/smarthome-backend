import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Driver } from '../enums/driver.enum';

export class VoucherDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}

export class VoucherCreateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;

  @IsNotEmpty()
  @IsDateString()
  readonly expiration: string;

  @IsNotEmpty()
  @IsEnum(Driver, {each: true, message: 'creator is not valid'})
  readonly creator: Driver;
}

export class VoucherUpdateDto extends VoucherDto {
  @IsOptional()
  @IsNumber()
  readonly remainingDistance?: number;

  @IsOptional()
  @IsBoolean()
  readonly isExpired?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly redeemed?: boolean;
}