import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query, StreamableFile } from '@nestjs/common';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './core/schemas/logbook.schema';
import { ApiKey } from '../authentication/core/decorators/apikey.decorator';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { Driver } from './core/enums/driver.enum';
import { ParseArray } from './core/pipes/ParseEnumArray.pipe';
import { VehicleTyp } from './core/enums/vehicle-typ.enum';
import { DateParameter } from './core/dto/parameters/date.parameter';
import { UpdateLogbookDto } from './core/dto/update-logbook.dto';
import { CreateLogbookInvoiceDto } from './core/dto/create-logbook-invoice.dto';
import { LogbookInvoice } from './core/schemas/logbook-invoice.schema';

@ApiKey()
@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    return this.logbookService.create(createLogbookDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/stats/driver')
  async getDriverStats(
    @Query() date: DateParameter,
    @Query(
      'drivers',
      new ParseArray({
        items: DriverParameter,
        type: Driver,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })
    )
      drivers?: DriverParameter[],
    @Query(
      'vehicles',
      new ParseArray({
        items: VehicleParameter,
        type: VehicleTyp,
        emptyHandling: {
          allow: true,
          allCases: true
        },
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })) vehicles?: VehicleParameter[],
    @Query('detailed') detailed?: boolean
  ) {
    return await this.logbookService.calculateDriverStats(drivers, date.startDate, date.endDate, vehicles, detailed);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/stats/vehicle')
  async getVehicleStats(
    @Query() date: DateParameter,
    @Query(
      'vehicles',
      new ParseArray({
        items: VehicleParameter,
        type: VehicleTyp,
        emptyHandling: {
          allow: true,
          allCases: true
        },
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })) vehicles?: VehicleParameter[]
  ) {
    return await this.logbookService.calculateVehicleStats(vehicles, date.startDate, date.endDate);
  }


  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/invoice/create')
  async createInvoice(@Body() createLogbookInvoiceDto: CreateLogbookInvoiceDto,
                      @Query('drivers',
                        new ParseArray({
                          items: DriverParameter,
                          type: Driver,
                          emptyHandling: {
                            allow: true,
                            allCases: true
                          },
                          separator: ',',
                          errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
                        })
                      )
                        drivers?: DriverParameter[],
                      @Query('emailDrivers',
                        new ParseArray({
                          items: DriverParameter,
                          type: Driver,
                          emptyHandling: {
                            allow: true,
                            allCases: false
                          },
                          separator: ',',
                          errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
                        })
                      )
                        emailDrivers?: DriverParameter[]): Promise<boolean> {
    return await this.logbookService.executeInvoice(createLogbookInvoiceDto, drivers, emailDrivers);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/invoice/history')
  async getInvoiceHistory(): Promise<LogbookInvoice[]> {
    return await this.logbookService.getInvoiceHistory();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/all')
  async findAll(@Query() date?: DateParameter,
                @Query('drivers',
                  new ParseArray({
                    items: DriverParameter,
                    type: Driver,
                    emptyHandling: {
                      allow: true,
                      allCases: true
                    },
                    separator: ',',
                    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
                  })
                ) drivers?: DriverParameter[],
                @Query('sort') sort?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.logbookService.findAll({
      ...drivers && {
        driver: drivers
      },
      ...(date && (date.startDate || date.endDate)) && {
        date: {
          ...date.startDate && {
            $gte: date.startDate
          },
          ...date.endDate && {
            $lte: date.endDate
          }
        }
      }
    }, sort, page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/latest')
  async findLatest(): Promise<Logbook[]> {
    return this.logbookService.findLatest();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/:_id')
  async findOne(@Param('_id') _id: string): Promise<Logbook> {
    return await this.logbookService.findOne(_id);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-disposition', 'attachment;filename=Fahrtenbuch_' + new Date().toISOString() + '.xlsx')
  @Header('Access-Control-Expose-Headers', 'Content-Disposition')
  @Get('/download')
  async download(
    @Query(
      'drivers',
      new ParseArray({
        items: DriverParameter,
        emptyHandling: {
          allow: true,
          allCases: true
        },
        type: Driver,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })
    )
      drivers?: DriverParameter[],
    @Query(
      'vehicles',
      new ParseArray({
        items: VehicleParameter,
        emptyHandling: {
          allow: true,
          allCases: true
        },
        type: VehicleTyp,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })
    )
      vehicles?: VehicleParameter[],
    @Query() date?: DateParameter
  ): Promise<StreamableFile> {
    const xlsx = await this.logbookService.download(drivers, vehicles, date.startDate, date.endDate);
    return new StreamableFile(xlsx);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':_id')
  async update(@Param('_id') _id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
    return await this.logbookService.update(_id, updateLogbookDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    await this.logbookService.remove(_id);
  }
}
