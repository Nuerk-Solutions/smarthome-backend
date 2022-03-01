import { IsEnum, IsOptional } from 'class-validator';
import { Driver } from '../../enums/driver.enum';

export class DriverParameter {
  @IsOptional()
  @IsEnum(Driver, { each: true, message: 'Drivers are not valid' })
  drivers?: Driver[];
}
