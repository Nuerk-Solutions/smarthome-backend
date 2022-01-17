import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { LogbookService } from './logbook.service';
import { Logbook } from './schemas/logbook.schema';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Post()
  async create(@Body() createLogbookDto: CreateLogbookDto) {
    return this.logbookService.create(createLogbookDto);
  }

  @Get()
  async findAll(): Promise<Logbook[]> {
    return this.logbookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logbookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogbookDto: UpdateLogbookDto) {
    return this.logbookService.update(+id, updateLogbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logbookService.remove(+id);
  }
}
