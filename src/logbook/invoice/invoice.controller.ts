import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateLogbookInvoiceDto } from '../core/dto/create-logbook-invoice.dto';
import { ParseArray } from '../core/validation/pipes/ParseEnumArray.pipe';
import { DriverParameter } from '../core/dto/parameters/driver.parameter';
import { Driver } from '../core/enums/driver.enum';
import { LogbookInvoice } from '../core/schemas/logbook-invoice.schema';
import { DateParameter } from '../core/dto/parameters/date.parameter';
import { StatsService } from '../stats/stats.service';

@Controller()
export class InvoiceController {
  constructor(private readonly _invoiceService: InvoiceService, private readonly _statsService: StatsService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/create')
  async createInvoice() {
    return await this._invoiceService.executeInvoice();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/history')
  async getInvoiceHistory(): Promise<LogbookInvoice[]> {
    return await this._invoiceService.getInvoiceHistory();
  }
}
