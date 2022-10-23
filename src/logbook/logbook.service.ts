import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Logbook } from './core/schemas/logbook.schema';
import { AdditionalInformationTyp } from './core/enums/additional-information-typ.enum';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { LogbooksRepository } from './logbooks.repository';
import { UpdateLogbookDto } from './core/dto/update-logbook.dto';
import { Types } from 'mongoose';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { DISTANCE_COST } from '../core/utils/constatns';

@Injectable()
export class LogbookService {
  constructor(
    // @InjectModel(Logbook.name, 'logbook')
    // private readonly logbookModel: Model<LogbookDocument>,
    // @InjectModel(Logbook.name, 'logbook')
    private readonly logbooksRepository: LogbooksRepository,
  ) {}

  // eslint-disable-next-line max-len
  // Create a function that checks if the data of the new logbook is older than the last logbook of the same vehicleTyp based on the date
  async checkIfNewLogbookIsOlder(createLogbookDto: CreateLogbookDto): Promise<boolean> {
    const lastLogbook: Logbook[] = await this.logbooksRepository.findLastAddedLogbookForVehicle(
      createLogbookDto.vehicleTyp,
    );
    if (lastLogbook.length > 0) {
      return createLogbookDto.date < lastLogbook[0].date;
    }
  }

  async updatePastLogbooks(logbooksToUpdate: Logbook[], createLogbookDto: CreateLogbookDto): Promise<void> {
    let lastUpdatedLogbook = createLogbookDto;
    for (const logbook of logbooksToUpdate) {
      logbook.currentMileAge = lastUpdatedLogbook.newMileAge;
      logbook.newMileAge = Number(+lastUpdatedLogbook.newMileAge + +logbook.distance).toFixed(0);

      // if (logbook.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
      //   const distance = +createLogbookDto.newMileAge - +createLogbookDto.currentMileAge;
      //   // let distanceSinceLastAdditionalInformation = '';
      //   // const LastAdditionalInformation = await this.logbookModel
      //   //   .findOne({
      //   //     vehicleTyp: lastUpdatedLogbook.vehicleTyp,
      //   //     additionalInformationTyp: lastUpdatedLogbook.additionalInformationTyp,
      //   //     date: { $lt: logbook.date },
      //   //   })
      //   //   .sort({ date: -1 })
      //   //   .limit(1)
      //   //   .exec();
      //   // if (LastAdditionalInformation) {
      //   const newDistance = distance + +logbook.distanceSinceLastAdditionalInformation;
      //   logbook.distanceSinceLastAdditionalInformation = newDistance.toFixed(2);
      //   // }
      // }
      lastUpdatedLogbook = logbook;
      await this.logbooksRepository.findOneAndUpdate(
        {
          _id: logbook._id,
        },
        {
          ...logbook,
        },
      );
    }
  }

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    const isContaining = await this.logbooksRepository.findOne({
      vehicleTyp: createLogbookDto.vehicleTyp,
      currentMileAge: createLogbookDto.currentMileAge,
    });

    // TODO: CHECK THIS
    if (isContaining) {
      if (!(await this.checkIfNewLogbookIsOlder(createLogbookDto))) {
        throw new BadRequestException('Logbook already exists');
      }
      const logbooksToUpdate: Logbook[] = await this.logbooksRepository.find({
        vehicleTyp: createLogbookDto.vehicleTyp,
        date: { $gt: createLogbookDto.date },
      });

      if (logbooksToUpdate != null && logbooksToUpdate.length > 0) {
        await this.updatePastLogbooks(logbooksToUpdate, createLogbookDto);
      }
    }

    const distance = Number(+createLogbookDto.newMileAge - +createLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * DISTANCE_COST).toFixed(2);
    let distanceSinceLastAdditionalInformation = '';

    if (createLogbookDto.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
      // eslint-disable-next-line max-len
      // Calculate the distance since the last additional information from the corresponding typ and from the same vehicleTyp
      const LastAdditionalInformation = await this.logbooksRepository.findLastAdditionalInformation(
        createLogbookDto.vehicleTyp,
        createLogbookDto.additionalInformationTyp,
      );

      if (LastAdditionalInformation.length > 0) {
        distanceSinceLastAdditionalInformation = Number(
          +createLogbookDto.newMileAge - +LastAdditionalInformation[0].newMileAge,
        ).toFixed(2);
      }
    }

    const submitLogbook = {
      ...createLogbookDto,
      distance,
      distanceCost,
      distanceSinceLastAdditionalInformation,
    };

    return await this.logbooksRepository.create(submitLogbook);
  }

  async findAll(filter?: object, sort?: StringSortParameter, page?: number, limit?: number): Promise<any> {
    // const total = await this.logbooksRepository.count().exec();
    // // Outbound protection
    // const protectedLimit = limit <= 0 || limit >= total ? 1 : limit;
    // const protectedPage = page < 0 ? 1 : page;
    //
    // // protectedSkip beware the query of any kind of outbound inputs
    // const skip = protectedPage <= 0 ? 0 : protectedPage * protectedLimit;
    // const protectedSkip = skip >= total ? total - (total % limit) : skip;
    //
    // return await this.logbooksRepository.find(filter).sort(sort).skip(protectedSkip).limit(limit).exec();
    return await this.logbooksRepository.getPagination(filter, page, limit, sort);
  }

  async findOne(id: string): Promise<Logbook> {
    return await this.logbooksRepository.findById(id);
  }

  async findLatest(): Promise<Logbook[]> {
    return this.logbooksRepository.findLastAddedLogbooks();
  }

  async download(
    drivers: DriverParameter[],
    vehicles: VehicleParameter[],
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const logbooks = await this.logbooksRepository.find(
      {
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
      },
      { date: 1 },
    );

    if (!logbooks.length) {
      throw new NotFoundException('No logbooks found');
    }

    const data = logbooks.map((logbook) => {
      // eslint-disable-next-line max-len
      // Calculate average consumption per 100km using additionalInformation as fuel and distanceSinceLastAdditionalInformation as distance
      let fuelConsumption;
      if (
        logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT &&
        +logbook.distanceSinceLastAdditionalInformation !== 0
      ) {
        fuelConsumption = Number(
          (+logbook.additionalInformation / +logbook.distanceSinceLastAdditionalInformation) * 100,
        ).toFixed(2);
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

  //
  // // <h1> TODO: Add exception handling for 404 of id </h1>
  async remove(_id: string): Promise<boolean> {
    return await this.logbooksRepository.deleteOneById(_id);
  }

  async update(id: string, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
    const targetLogbook = await this.logbooksRepository.findById(id);

    if (targetLogbook == null) {
      throw new NotFoundException('Logbook not found');
    }
    const distance = Number(+updateLogbookDto.newMileAge - +targetLogbook.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * DISTANCE_COST).toFixed(2);

    const lastAddedLogbook = await this.logbooksRepository.findLastAddedLogbookForVehicle(targetLogbook.vehicleTyp);
    if (lastAddedLogbook == null || lastAddedLogbook.length === 0) {
      throw new NotFoundException('No valid last added logbook found');
    }

    if (lastAddedLogbook[0]._id.toString() !== targetLogbook._id.toString()) {
      console.log('Logbook is not the last added logbook');
      console.log(
        "Removing newMilAge and currentMileAge from updateLogbookDto because it's not the last added logbook",
      );
      delete updateLogbookDto.newMileAge;
      // @ts-ignore
      delete updateLogbookDto.currentMileAge;
      return await this.logbooksRepository.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        updateLogbookDto,
      );
    }

    return await this.logbooksRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
      },
      {
        distance,
        distanceCost,
        ...updateLogbookDto,
      },
    );
  }
}
