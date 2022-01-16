import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogbookService } from './logbook.service';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Post()
  create(@Body() createLogbookDto: CreateLogbookDto) {
    return this.logbookService.create(createLogbookDto);
  }

  @Get()
  findAll() {
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
