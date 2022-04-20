import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Query, StreamableFile, ValidationPipe } from '@nestjs/common';
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
  @Get('/stats/:type')
  async getStats(
    @Param('type') type: string,
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
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })) vehicles?: VehicleParameter[],
    @Query('detailed') detailed?: boolean
  ) {
    if (type === 'driver')
      return await this.logbookService.calculateDriverStats(date.date, drivers, vehicles, detailed);
    else if (type === 'vehicle')
      return await this.logbookService.calculateVehicleStats(date.date, vehicles);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/all')
  async findAll(@Query('sort') sort?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<Logbook[]> {
    return await this.logbookService.findAll(undefined, sort, page, limit);
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
  // TODO: validate enum array
  async download(
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
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
      })
    )
      vehicles?: VehicleParameter[]
  ): Promise<StreamableFile> {
    const xlsx = await this.logbookService.download(drivers, vehicles);
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
