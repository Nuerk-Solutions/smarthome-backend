import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, StreamableFile } from '@nestjs/common';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './core/schemas/logbook.schema';
import { ApiKey } from '../authentication/core/decorators/apikey.decorator';

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
    return this.logbookService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-disposition', 'attachment;filename=LogBook_' + new Date().toISOString() + '_Language_DE.xlsx')
  @Header('Access-Control-Expose-Headers', 'Content-Disposition')
  @Get('/download')
  async download(): Promise<StreamableFile> {
    const xlsx = await this.logbookService.download();
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
