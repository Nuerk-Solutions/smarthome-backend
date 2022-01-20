import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { Logbook, LogbookDocument } from './schemas/logbook.schema';

@Injectable()
export class LogbookService {
  private readonly logger = new Logger(LogbookService.name);

  constructor(
    @InjectModel(Logbook.name)
    private readonly logbookModel: Model<LogbookDocument>,
  ) { }

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    const distance = +createLogbookDto.newMileAge - +createLogbookDto.currentMileAge;

    const logbook = {
      ...createLogbookDto,
      distance,
      distanceCost: distance * 0.2,
    };
    const createdLogbook = await this.logbookModel.create(logbook);
    return createdLogbook;
  }

  async findAll(sort: string): Promise<Logbook[]> {
    return this.logbookModel.find().sort(sort).exec();
  }

  async findOne(id: number): Promise<Logbook> {
    return this.logbookModel.findOne({ _id: id });
  }

  async findLatest(): Promise<Logbook[]> {
    // Find respectively the last added entry of vehicleTyp VW or Ferrari
    const latestLogbookVw = await this.logbookModel.findOne({ vehicleTyp: 'VW' }).sort({ createdAt: -1 }).limit(1).exec();
    const latestLogbookFerrari = await this.logbookModel.findOne({ vehicleTyp: 'Ferrari' }).sort({ createdAt: -1 }).limit(1).exec();
    return [latestLogbookVw, latestLogbookFerrari];
  }

  async download(): Promise<Buffer> {
    const logbooks = await this.logbookModel.find().sort({ date: 1 }).exec();

    if (!logbooks) {
      throw new NotFoundException('No logbooks found');
    }
    const data = logbooks.map((logbook) => {
      return {
        Fahrer: logbook.driver,
        Fahrzeug_Typ: logbook.vehicleTyp,
        'Aktueller Kilometerstand': logbook.currentMileAge,
        'Neuer Kilometerstand': logbook.newMileAge,
        Entfernung: logbook.distance,
        Kosten: logbook.distanceCost,
        Datum: logbook.date,
        Grund: logbook.driveReason,
        'Zusatzinformationen - Art': logbook.additionalInformationTyp,
        'Zusatzinformationen - Inhalt': logbook.additionalInformation,
        'Zusatzinformationen - Kosten': logbook.additionalInformationCost,
        'Entfernung seit letzter Information': logbook.distanceSinceLastAdditionalInformation,
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'LogBook');
    // Generate buffer
    const buffer = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    return buffer;
  }

  async remove(id: number): Promise<Logbook> {
    return this.logbookModel.findOneAndDelete({ _id: id });
  }
}
