import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { LogbookService } from './logbook.service';
import { Logbook } from './core/schemas/logbook.schema';
import { ApiKey } from '../authentication/core/decorators/apikey.decorator';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { Driver } from './core/enums/driver.enum';
import { ParseArray } from './core/validation/pipes/ParseEnumArray.pipe';
import { DateParameter } from './core/dto/parameters/date.parameter';
import { ParseSortString } from './core/validation/pipes/ParseSortString.pipe';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { VehicleTyp } from './core/enums/vehicle-typ.enum';
import { UpdateLogbookDto } from './core/dto/update-logbook.dto';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';

@ApiKey()
@Controller()
export class LogbookController {
  constructor(private readonly _logbookService: LogbookService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    return this._logbookService.create(createLogbookDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/all')
  async findAll(
    @Query() date?: DateParameter,
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
    @Query('sort', new ParseSortString())
    sort?: StringSortParameter,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginateResult<Logbook>> {
    return await this._logbookService.findAll(
      {
        ...(drivers && {
          driver: drivers,
        }),
        ...(date &&
          (date.startDate || date.endDate) && {
            date: {
              ...(date.startDate && {
                $gte: date.startDate,
              }),
              ...(date.endDate && {
                $lte: date.endDate,
              }),
            },
          }),
      },
      sort,
      page,
      limit,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/latest')
  async findLatest(): Promise<Logbook[]> {
    return this._logbookService.findLatest();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find/:_id')
  async findOne(@Param('_id') _id: string): Promise<Logbook> {
    return await this._logbookService.findOne(_id);
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
          allCases: true,
        },
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
        emptyHandling: {
          allow: true,
          allCases: true,
        },
        type: VehicleTyp,
        separator: ',',
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    vehicles?: VehicleParameter[],
    @Query() date?: DateParameter,
  ): Promise<StreamableFile> {
    const xlsx = await this._logbookService.download(drivers, vehicles, date.startDate, date.endDate);
    return new StreamableFile(xlsx);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':_id')
  async update(@Param('_id') _id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
    return await this._logbookService.update(_id, updateLogbookDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    const successful = await this._logbookService.remove(_id);
    if (!successful) {
      throw new HttpException('Could not delete logbook entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
