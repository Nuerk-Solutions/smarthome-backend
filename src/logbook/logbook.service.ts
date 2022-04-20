import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as XLSX from 'xlsx';
import { Logbook, LogbookDocument } from './core/schemas/logbook.schema';
import { CreateLogbookDto } from './core/dto/create-logbook.dto';
import { AdditionalInformationTyp } from './core/enums/additional-information-typ.enum';
import { VehicleParameter } from './core/dto/parameters/vehicle.parameter';
import { DriverParameter } from './core/dto/parameters/driver.parameter';
import { VehicleTyp } from './core/enums/vehicle-typ.enum';
import { Driver } from './core/enums/driver.enum';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel(Logbook.name)
    private readonly logbookModel: Model<LogbookDocument>
  ) {
  }

  async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
    const distance = Number(+createLogbookDto.newMileAge - +createLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * 0.2).toFixed(2);
    let distanceSinceLastAdditionalInformation = '';

    if (createLogbookDto.additionalInformationTyp !== AdditionalInformationTyp.KEINE) {
      // Calculate the distance since the last additional information from the corrosponding typ and from the same vehicleTyp
      const LastAdditionalInformation = await this.logbookModel
        .findOne({
          vehicleTyp: createLogbookDto.vehicleTyp,
          additionalInformationTyp: createLogbookDto.additionalInformationTyp
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
      distanceSinceLastAdditionalInformation
    };

    return await this.logbookModel.create(logbook);
  }

  async findAll(filter?: object, sort?: string, page?: number, limit?: number): Promise<Logbook[]> {
    const total = await this.logbookModel.count({}).exec();
    // Outbound protection
    const protectedLimit = limit <= 0 || limit >= total ? 1 : limit;
    const protectedPage = page < 0 || page > total ? 1 : page;

    // protectedSkip beware the query of any kind of outbound inputs
    const skip = protectedPage <= 0 ? 0 : protectedPage * protectedLimit;
    const protectedSkip = skip >= total ? total - limit : skip;

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

  async download(drivers: DriverParameter[], vehicles: VehicleParameter[]): Promise<Buffer> {
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
        'Durchschnittlicher Verbrauch': fuelConsumption || ''
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'LogBook');
    // Generate buffer
    return XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer'
    });
  }

  async calculateVehicleStats(startDate: string, vehicles: VehicleParameter[]) {
    const logbooks: Logbook[] = await this.findAll({
        vehicleTyp: vehicles,
        date: {
          $gt: new Date(startDate)
        }
      },
      '-date');

    return logbooks
      .map(item => {
        return {
          vehicle: item.vehicleTyp,
          distance: +item.distance,
          distanceCost: +item.distanceCost
        };
      })
      .reduce((previousValue, currentValue) => {
        const existingVehicle = previousValue.find(item => item.vehicle === currentValue.vehicle);

        if (existingVehicle) {
          existingVehicle.distance += currentValue.distance;
          existingVehicle.distanceCost += currentValue.distanceCost;
        } else previousValue.push({ ...currentValue });

        return previousValue;
      }, [] as { distance: number, distanceCost: number, vehicle: VehicleTyp }[]);
  }

  async calculateDriverStats(startDate: string, drivers: DriverParameter[], vehicles: VehicleParameter[], detailed: boolean = true) {
    const logbooks: Logbook[] = await this.findAll({
        vehicleTyp: vehicles,
        driver: drivers,
        date: {
          $gt: new Date(startDate)
        }
      },
      '-date');

    return logbooks
      // Map the values and transform cost into number
      .map(item => {
        return {
          driver: item.driver,
          vehicle: item.vehicleTyp,
          distance: +item.distance,
          distanceCost: +item.distanceCost
        };
      })
      // sum the cost for every driver
      .reduce((previousValue, currentValue) => {
        let existingDriver = previousValue.find(item => item.driver === currentValue.driver); // Check if driver already exists once in new array

        if (existingDriver) { // If driver exists keep going
          existingDriver.distanceCost += currentValue.distanceCost;
          existingDriver.distance += currentValue.distance;

          if (!detailed)
            return previousValue;

          if (existingDriver.vehicles[currentValue.vehicle]) { // If vehicles contains the key of the vehicle keep going
            existingDriver.vehicles[currentValue.vehicle].distance += currentValue.distance;
            existingDriver.vehicles[currentValue.vehicle].distanceCost += currentValue.distanceCost;
          } else { // Else add the missing vehicle to the vehicles array including the already containing ones
            existingDriver.vehicles = {
              ...existingDriver.vehicles,
              [currentValue.vehicle]: {
                distance: currentValue.distance,
                distanceCost: currentValue.distanceCost
              }
            };
          }
        } else previousValue.push(
          { // Declaration for each to avoid vehicle property
            driver: currentValue.driver,
            distance: currentValue.distance,
            distanceCost: currentValue.distanceCost,
            ...detailed && {
              vehicles: {
                [currentValue.vehicle]: {
                  distance: currentValue.distance,
                  distanceCost: currentValue.distanceCost
                }
              }
            }
          }
        ); // Else add new value if not exist in Array vvv
        return previousValue;
      }, [] as { driver: Driver, distance: number, distanceCost: number, vehicles: { [vehicle: string]: { distance: number, distanceCost: number } } }[]); // This array ^^^
  }

  async remove(id: number): Promise<Logbook> {
    return this.logbookModel.findOneAndDelete({ _id: id });
  }
}
