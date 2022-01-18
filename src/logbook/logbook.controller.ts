import { Body, Controller, Delete, Get, Header, Logger, Param, Post, Query, StreamableFile } from '@nestjs/common';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './schemas/logbook.schema';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}
  private readonly logger = new Logger(LogbookController.name);

  @Post()
  async create(@Body() createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    return this.logbookService.create(createLogbookDto);
  }

  @Get('/find/all')
  async findAll(@Query('sort') query: string): Promise<Logbook[]> {
    return this.logbookService.findAll(query);
  }

  @Get('find/latest')
  async findLatest(): Promise<Logbook[]> {
    return this.logbookService.findLatest();
  }

  @Get('find/:id')
  async findOne(@Param('id') id: string): Promise<Logbook> {
    return this.logbookService.findOne(+id);
  }

  @Get('download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-disposition', 'attachment;filename=LogBook_' + new Date().toISOString() + '_Language_DE.xlsx')
  @Header('Access-Control-Expose-Headers', 'Content-Disposition')
  async download(): Promise<StreamableFile> {
    const xlsx = await this.logbookService.download();
    return new StreamableFile(xlsx);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
  //   return this.logbookService.update(+id, updateLogbookDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Logbook> {
    return this.logbookService.remove(+id);
  }
}
