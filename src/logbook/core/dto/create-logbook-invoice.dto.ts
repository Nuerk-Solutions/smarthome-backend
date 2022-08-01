import { IsDateString, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateLogbookInvoiceDto {
  @IsNotEmpty()
  @IsDateString()
  @IsISO8601()
  endDate: Date;
}
