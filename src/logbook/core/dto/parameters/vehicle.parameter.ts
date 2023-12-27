import { IsEnum, IsOptional } from 'class-validator';
import { Vehicle } from '../../enums/vehicle-typ.enum';

export class VehicleParameter {
  @IsOptional()
  @IsEnum(Vehicle, { each: true, message: 'Vehicles are not valid' })
  vehicles?: Vehicle[];
}
