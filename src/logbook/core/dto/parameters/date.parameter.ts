import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class DateParameter {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;


  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
