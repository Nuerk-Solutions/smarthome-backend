import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
  //   return this.logbookService.update(+id, updateLogbookDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Logbook> {
    return this.logbookService.remove(+id);
  }
}
