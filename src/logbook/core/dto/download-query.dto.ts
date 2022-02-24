import { VehicleTyp } from '../enums/vehicle-typ.enum';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Driver } from '../enums/driver.enum';

export class DownloadQueryDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Driver, { each: true, message: 'Driver is not valid' })
  driver?: Driver[];

  @IsOptional()
  @IsArray()
  @IsEnum(VehicleTyp, { each: true, message: 'VehicleTyp is not valid' })
  vehicleTyp?: VehicleTyp[];
}
