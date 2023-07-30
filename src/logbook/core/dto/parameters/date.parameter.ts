import { IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class DateParameter {
  @ValidateIf((o) => o.endDate == null, {message: 'startDate or endDate must be a valid ISO 8601 date string'})
  @IsDateString({strict: false}, {message: 'startDate or endDate must be a valid ISO 8601 date string'})
  startDate: Date;

  @IsOptional()
  @IsDateString({ strict: false }, { message: 'startDate or endDate must be a valid ISO 8601 date string' })
  endDate?: Date;
}
