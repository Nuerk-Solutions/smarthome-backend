import { Injectable } from '@nestjs/common';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';

@Injectable()
export class LogbookService {
  create(createLogbookDto: CreateLogbookDto) {
    return createLogbookDto ?? 'This action adds a new logbook';
  }

  findAll() {
    return `This action returns all logbook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logbook`;
  }

  update(id: number, updateLogbookDto: UpdateLogbookDto) {
    return `This action updates a #${id} logbook`;
  }

  remove(id: number) {
    return `This action removes a #${id} logbook`;
  }
}
