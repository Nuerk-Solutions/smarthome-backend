import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { DateParameter } from '../core/dto/parameters/date.parameter';
import { ParseArray } from '../core/validation/pipes/ParseEnumArray.pipe';
import { DriverParameter } from '../core/dto/parameters/driver.parameter';
import { Driver } from '../core/enums/driver.enum';

@Controller()
export class StatsController {
  constructor(private readonly _statsService: StatsService) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('/driver')
  async getDriverStats(
    @Query() date: DateParameter,
    @Query(
      'drivers',
      new ParseArray({
        items: DriverParameter,
        type: Driver,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
      drivers?: DriverParameter[],
  ) {
    return await this._statsService.getDriverStats(drivers, date.startDate, date.endDate);
  }
}
