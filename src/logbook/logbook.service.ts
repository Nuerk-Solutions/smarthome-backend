import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { Logbook, LogbookDocument } from './schemas/logbook.schema';

@Injectable()
export class LogbookService {
  private readonly logger = new Logger(LogbookService.name);

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

  async findOne(id: number): Promise<Logbook> {
    return this.logbookModel.findOne({ _id: id });
  }

  async findLatest(): Promise<Logbook[]> {
    // Find respectively the last added entry of vehicleTyp VW or Ferrari
    const latestLogbookVw = await this.logbookModel
      .findOne({ vehicleTyp: 'VW' })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    const latestLogbookFerrari = await this.logbookModel
      .findOne({ vehicleTyp: 'Ferrari' })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    return [latestLogbookVw, latestLogbookFerrari];
  }

  // async update(id: number, updateLogbookDto: UpdateLogbookDto) {
  //   return `This action updates a #${id} logbook`;
  // }

  async remove(id: number): Promise<Logbook> {
    return this.logbookModel.findOneAndDelete({ _id: id });
  }
}
