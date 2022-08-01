import { IsDateString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Driver } from '../../enums/driver.enum';

export class InvoiceParameter {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver: Driver;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
