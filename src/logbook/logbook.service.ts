import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook, LogbookDocument } from './schemas/logbook.schema';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel(Logbook.name)
    private readonly logbookModel: Model<LogbookDocument>,
  ) {}

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    const createdLogbook = await this.logbookModel.create(createLogbookDto);
    return createdLogbook;
  }

  async findAll(): Promise<Logbook[]> {
    return this.logbookModel.find().exec();
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
