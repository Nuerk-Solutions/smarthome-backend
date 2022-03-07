import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { Logbook, LogbookDocument } from './core/schemas/logbook.schema';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { AdditionalInformationTyp } from './core/enums/additional-information-typ.enum';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel(Logbook.name)
    private readonly logbookModel: Model<LogbookDocument>,
  ) {}

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    const distance = Number(+createLogbookDto.newMileAge - +createLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * 0.2).toFixed(2);
    let distanceSinceLastAdditionalInformation = '';

    if (createLogbookDto.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
      // Calculate the distance since the last additional information from the corrosponding typ and from the same vehicleTyp
      const LastAdditionalInformation = await this.logbookModel
        .findOne({
          vehicleTyp: createLogbookDto.vehicleTyp,
          additionalInformationTyp: createLogbookDto.additionalInformationTyp,
        })
        .sort({ date: -1 })
        .limit(1)
        .exec();
      if (LastAdditionalInformation) {
        distanceSinceLastAdditionalInformation = Number(+createLogbookDto.newMileAge - +LastAdditionalInformation.newMileAge).toFixed(2);
      }
    }

    const logbook = {
      ...createLogbookDto,
      distance,
      distanceCost,
      distanceSinceLastAdditionalInformation,
    };

    return await this.logbookModel.create(logbook);
  }

  async findAll(sort?: string): Promise<Logbook[]> {
    return this.logbookModel.find().sort(sort).exec();
  }

  async findOne(id: string): Promise<Logbook> {
    return this.logbookModel.findById(id);
  }

  async findLatest(): Promise<Logbook[]> {
    // Find respectively the last added entry of vehicleTyp VW or Ferrari
    const latestLogbookVw = await this.logbookModel.findOne({ vehicleTyp: 'VW' }).sort({ date: -1 }).limit(1).exec();
    const latestLogbookFerrari = await this.logbookModel.findOne({ vehicleTyp: 'Ferrari' }).sort({ date: -1 }).limit(1).exec();

    // Throw error if no logbook was found
    if (!latestLogbookVw && !latestLogbookFerrari) {
      throw new NotFoundException('No logbooks found');
    }

    return [latestLogbookVw, latestLogbookFerrari];
  }

  async download(drivers, vehicles): Promise<Buffer> {
    const filterObject: any = {};
    if (vehicles) {
      filterObject.vehicleTyp = vehicles;
    }
    if (drivers) {
      filterObject.driver = drivers;
    }
    const logbooks = await this.logbookModel.find(filterObject).sort({ date: 1 }).exec();

    if (!logbooks.length) {
      throw new NotFoundException('No logbooks found');
    }

    const data = logbooks.map((logbook) => {
      // Calculate average consumption per 100km using additionalInformation as fuel and distanceSinceLastAdditionalInformation as distance
      let fuelConsumption;
      if (logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT && +logbook.distanceSinceLastAdditionalInformation !== 0) {
        fuelConsumption = Number((+logbook.additionalInformation / +logbook.distanceSinceLastAdditionalInformation) * 100).toFixed(2);
      }
      return {
        Fahrer: logbook.driver,
        Fahrzeug_Typ: logbook.vehicleTyp,
        'Aktueller Kilometerstand': +logbook.currentMileAge,
        'Neuer Kilometerstand': +logbook.newMileAge,
        Entfernung: +logbook.distance,
        Kosten: logbook.distanceCost,
        Datum: logbook.date,
        Grund: logbook.driveReason,
        'Zusatzinformationen - Art': logbook.additionalInformationTyp,
        'Zusatzinformationen - Inhalt': logbook.additionalInformation,
        'Zusatzinformationen - Kosten': logbook.additionalInformationCost,
        'Entfernung seit letzter Information': logbook.distanceSinceLastAdditionalInformation,
        'Durchschnittlicher Verbrauch': fuelConsumption || '',
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'LogBook');
    // Generate buffer
    return XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
  }

  async remove(id: number): Promise<Logbook> {
    return this.logbookModel.findOneAndDelete({ _id: id });
  }
}
