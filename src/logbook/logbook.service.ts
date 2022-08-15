import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as XLSX from 'xlsx';
import { Logbook, LogbookDocument } from './core/schemas/logbook.schema';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { AdditionalInformationTyp } from './core/enums/additional-information-typ.enum';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { UpdateLogbookDto } from './core/dto/update-logbook.dto';
import { VehicleTyp } from './core/enums/vehicle-typ.enum';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel(Logbook.name, 'logbook')
    private readonly logbookModel: Model<LogbookDocument>,
  ) {}

  // Create a function that checks if the data of the new logbook is older than the last logbook of the same vehicleTyp based on the date
  async checkIfNewLogbookIsOlder(vehicleTyp: VehicleTyp, date: Date): Promise<boolean> {
    const lastLogbook: Logbook = await this.logbookModel
      .findOne({
        vehicleTyp: vehicleTyp,
      })
      .sort({ date: -1 })
      .limit(1)
      .exec();
    if (lastLogbook) {
      const date1 = new Date(date);
      const date2 = new Date(lastLogbook.date);
      console.log(date1);
      console.log(date2);
      return date1 < date2;
    }
    return true;
  }

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    // if (true) {
    if (await this.checkIfNewLogbookIsOlder(createLogbookDto.vehicleTyp, createLogbookDto.date)) {
      console.log('A');
      const logbooksToUpdate: Logbook[] = await this.findAll({
        vehicleTyp: createLogbookDto.vehicleTyp,
        date: { $gt: createLogbookDto.date },
      });

      let lastUpdatedLogbook = createLogbookDto;
      for (const logbook of logbooksToUpdate) {
        logbook.currentMileAge = lastUpdatedLogbook.newMileAge;
        logbook.newMileAge = Number(+lastUpdatedLogbook.newMileAge + +logbook.distance).toFixed(0);

        if (logbook.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
          const distance = +createLogbookDto.newMileAge - +createLogbookDto.currentMileAge;
          // let distanceSinceLastAdditionalInformation = '';
          // const LastAdditionalInformation = await this.logbookModel
          //   .findOne({
          //     vehicleTyp: lastUpdatedLogbook.vehicleTyp,
          //     additionalInformationTyp: lastUpdatedLogbook.additionalInformationTyp,
          //     date: { $lt: logbook.date },
          //   })
          //   .sort({ date: -1 })
          //   .limit(1)
          //   .exec();
          // if (LastAdditionalInformation) {
          const newDistance = distance + +logbook.distanceSinceLastAdditionalInformation;
          logbook.distanceSinceLastAdditionalInformation = newDistance.toFixed(2);
          // }
        }
        lastUpdatedLogbook = logbook;
        await this.logbookModel
          .findOneAndUpdate(
            {
              _id: logbook._id,
            },
            {
              ...logbook,
            },
            { new: true },
          )
          .exec();
      }
    }

    const distance = Number(+createLogbookDto.newMileAge - +createLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * 0.2).toFixed(2);
    let distanceSinceLastAdditionalInformation = '';

    if (createLogbookDto.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
      // Calculate the distance since the last additional information from the corresponding typ and from the same vehicleTyp
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

  async findAll(filter?: object, sort?: string, page?: number, limit?: number): Promise<Logbook[]> {
    const total = await this.logbookModel.count().exec();
    // Outbound protection
    const protectedLimit = limit <= 0 || limit >= total ? 1 : limit;
    const protectedPage = page < 0 ? 1 : page;

    // protectedSkip beware the query of any kind of outbound inputs
    const skip = protectedPage <= 0 ? 0 : protectedPage * protectedLimit;
    const protectedSkip = skip >= total ? total - (total % limit) : skip;

    return await this.logbookModel.find(filter).sort(sort).skip(protectedSkip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Logbook> {
    return await this.logbookModel.findById(new Types.ObjectId(id)).exec();
  }

  async findLatest(): Promise<Logbook[]> {
    // Find respectively the last added entry of vehicleTyp VW or Ferrari
    const latestLogbookVw = await this.logbookModel.findOne({ vehicleTyp: 'VW' }).sort({ newMileAge: -1 }).limit(1).exec();
    const latestLogbookFerrari = await this.logbookModel.findOne({ vehicleTyp: 'Ferrari' }).sort({ newMileAge: -1 }).limit(1).exec();
    const latestLogbookPorsche = await this.logbookModel.findOne({ vehicleTyp: 'Porsche' }).sort({ newMileAge: -1 }).limit(1).exec();

    // Throw error if no logbook was found
    if (!latestLogbookVw && !latestLogbookFerrari && !latestLogbookPorsche) {
      throw new NotFoundException('No logbooks found');
    }

    return [latestLogbookVw, latestLogbookFerrari, latestLogbookPorsche];
  }

  async download(drivers: DriverParameter[], vehicles: VehicleParameter[], startDate: Date, endDate: Date): Promise<Buffer> {
    const logbooks = await this.logbookModel
      .find({
        vehicleTyp: vehicles,
        driver: drivers,
        date: {
          ...(startDate && {
            $gte: startDate,
          }),
          ...(endDate && {
            $lte: endDate,
          }),
        },
      })
      .sort({ date: 1 })
      .exec();

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
        Fahrzeug: logbook.vehicleTyp,
        'Aktueller Kilometerstand': +logbook.currentMileAge,
        'Neuer Kilometerstand': +logbook.newMileAge,
        Uebernommen: logbook.forFree ? 'Ja' : 'Nein',
        Strecke: +logbook.distance,
        Kosten: logbook.distanceCost,
        Datum: logbook.date,
        Reiseziel: logbook.driveReason,
        'Zusatzinformationen - Art': logbook.additionalInformationTyp,
        'Zusatzinformationen - Inhalt': logbook.additionalInformation,
        'Zusatzinformationen - Kosten': logbook.additionalInformationCost,
        'Entfernung seit letzter Information': logbook.distanceSinceLastAdditionalInformation,
        'Durchschnittlicher Verbrauch': fuelConsumption || '',
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Fahrtenbuch');
    // Generate buffer
    return XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
  }

  // <h1> TODO: Add exception handling for 404 of id </h1>
  async remove(_id: string) {
    await this.logbookModel.deleteOne({ _id: new Types.ObjectId(_id) }).exec();
  }

  // TODO: Add safety check for update task. Currently only managed with UI lock
  async update(id: string, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
    const distance = Number(+updateLogbookDto.newMileAge - +updateLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * 0.2).toFixed(2);

    return await this.logbookModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        {
          distance,
          distanceCost,
          ...updateLogbookDto,
        },
        { new: true },
      )
      .exec();
  }
}
