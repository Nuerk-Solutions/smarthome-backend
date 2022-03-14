import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, StreamableFile } from '@nestjs/common';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './core/schemas/logbook.schema';
import { ApiKey } from '../authentication/core/decorators/apikey.decorator';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { Driver } from './core/enums/driver.enum';
import { ParseArray } from './core/pipes/ParseEnumArray.pipe';
import { VehicleTyp } from './core/enums/vehicle-typ.enum';

@ApiKey()
@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    return this.logbookService.create(createLogbookDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/all')
  async findAll(@Query('sort') query?: string): Promise<Logbook[]> {
    return this.logbookService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/latest')
  async findLatest(): Promise<Logbook[]> {
    return this.logbookService.findLatest();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/:id')
  async findOne(@Param('id') id: string): Promise<Logbook> {
    return await this.logbookService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-disposition', 'attachment;filename=LogBook_' + new Date().toISOString() + '_Language_DE.xlsx')
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
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    drivers?: DriverParameter[],
    @Query(
      'vehicles',
      new ParseArray({
        items: VehicleParameter,
        type: VehicleTyp,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    vehicles?: VehicleParameter[],
  ): Promise<StreamableFile> {
    console.log(drivers, vehicles);

    const xlsx = await this.logbookService.download(drivers, vehicles);
    return new StreamableFile(xlsx);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
  //   return this.logbookService.update(+id, updateLogbookDto);
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<void> {
  //   await this.logbookService.remove(+id);
  // }
}
