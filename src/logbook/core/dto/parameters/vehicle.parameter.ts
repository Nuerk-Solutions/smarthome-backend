import { IsEnum, IsOptional } from 'class-validator';
import { VehicleTyp } from '../../enums/vehicle-typ.enum';

export class VehicleParameter {
  @IsOptional()
  @IsEnum(VehicleTyp, { each: true, message: 'Vehicles are not valid' })
  vehicles?: VehicleTyp[];
}
