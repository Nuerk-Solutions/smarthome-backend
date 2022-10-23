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
  async createInvoice(
    @Body() createLogbookInvoiceDto: CreateLogbookInvoiceDto,
    @Query(
      'drivers',
      new ParseArray({
        items: DriverParameter,
        type: Driver,
        emptyHandling: {
          allow: true,
          allCases: true,
        },
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    drivers?: DriverParameter[],
    @Query(
      'emailDrivers',
      new ParseArray({
        items: DriverParameter,
        type: Driver,
        emptyHandling: {
          allow: true,
          allCases: false,
        },
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    emailDrivers?: DriverParameter[],
  ): Promise<boolean> {
    return await this._invoiceService.executeInvoice(createLogbookInvoiceDto, drivers, emailDrivers);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/history')
  async getInvoiceHistory(): Promise<LogbookInvoice[]> {
    return await this._invoiceService.getInvoiceHistory();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/summary')
  async sendInvoiceSummary(@Query() date: DateParameter, @Query('email') email: string): Promise<void> {
    const invoiceStats = await this._statsService.calculateDriverStats(
      [Driver.ANDREA, Driver.THOMAS],
      date.startDate,
      date.endDate,
    );
    const sumThomas = invoiceStats.find((item) => item.driver === Driver.THOMAS).distanceCost;
    const sumAndrea = invoiceStats.find((item) => item.driver === Driver.ANDREA).distanceCost;

    await this._invoiceService.sendInvoiceSummary(
      {
        email: email,
        driver: Driver.CLAUDIA,
        endDate: new Date(date.endDate),
        startDate: new Date(date.startDate),
      },
      sumThomas,
      sumAndrea,
      sumThomas + sumAndrea,
    );
  }
}
