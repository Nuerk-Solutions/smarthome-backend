import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { LogbookInvoice } from '../core/schemas/logbook-invoice.schema';

@Controller()
export class InvoiceController {
  constructor(private readonly _invoiceService: InvoiceService) {}

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
