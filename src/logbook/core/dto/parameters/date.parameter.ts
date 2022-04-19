import { IsDateString, IsNotEmpty } from 'class-validator';

export class DateParameter {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
