import { IsDateString, IsOptional } from 'class-validator';

export class DateParameter {
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
