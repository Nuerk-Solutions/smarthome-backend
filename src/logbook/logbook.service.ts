import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { UpdateLogbookDto } from './core/dto/update-logbook.dto';
import { MailService } from '../core/mail/mail.service';
import * as SendGrid from '@sendgrid/mail';
import { convertToMonth } from '../core/utils/date.util';
import { InvoiceParameter } from './core/dto/parameters/invoice.parameter';
import { LogbookInvoice, LogbookInvoiceDocument } from './core/schemas/logbook-invoice.schema';
import { CreateLogbookInvoiceDto } from './core/dto/create-logbook-invoice.dto';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel(Logbook.name)
    private readonly logbookModel: Model<LogbookDocument>,
    @InjectModel(LogbookInvoice.name)
    private readonly logbookInvoiceModel: Model<LogbookInvoiceDocument>,
    private readonly _mailService: MailService
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
    const total = await this.logbookModel.count().exec();
    // Outbound protection
    const protectedLimit = limit <= 0 || limit >= total ? 1 : limit;
    const protectedPage = page < 0 ? 1 : page;

    // protectedSkip beware the query of any kind of outbound inputs
    const skip = protectedPage <= 0 ? 0 : protectedPage * protectedLimit;
    const protectedSkip = skip >= total ? total - total % limit : skip;

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
    const logbooks = await this.logbookModel.find({
      vehicleTyp: vehicles,
      driver: drivers
    }).sort({ date: 1 }).exec();

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
        'Uebernommen': logbook.forFree ? 'Ja' : 'Nein',
        Strecke: +logbook.distance,
        Kosten: logbook.distanceCost,
        Datum: logbook.date,
        Reiseziel: logbook.driveReason,
        'Zusatzinformationen - Art': logbook.additionalInformationTyp,
        'Zusatzinformationen - Inhalt': logbook.additionalInformation,
        'Zusatzinformationen - Kosten': logbook.additionalInformationCost,
        'Entfernung seit letzter Information': logbook.distanceSinceLastAdditionalInformation,
        'Durchschnittlicher Verbrauch': fuelConsumption || ''
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Fahrtenbuch');
    // Generate buffer
    return XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'buffer'
    });
  }

  async calculateVehicleStats(vehicles: VehicleParameter[], startDate?: Date, endDate?: Date) {
    const logbooks: Logbook[] = await this.findAll({
        vehicleTyp: vehicles,
        date: {
          ...startDate && {
            $gt: startDate
          },
          ...endDate && {
            $lt: endDate
          }
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

  /**
   *
   * @param startDate Is the date from which to start count
   * @param endDate
   * @param drivers All drivers that should be displayed in the output
   * @param vehicles All vehicles that should be displayed in the output
   * @param detailed Detailed information to every driver
   */
  async calculateDriverStats(drivers: DriverParameter[], startDate?: Date, endDate?: Date, vehicles?: VehicleParameter[], detailed: boolean = true): Promise<{
      driver: Driver, distance: number, distanceCost: number, drivesCostForFree?: number,
      vehicles: {
        [p: string]: {
          distance: number, distanceCost: number, drivesCostForFree?: number
        }
      }
    }[]> {

    const logbooks: Logbook[] = await this.findAll({
      vehicleTyp: vehicles || Object.values(VehicleTyp),
      driver: drivers,
      date: {
        ...startDate && {
          $gt: startDate
        },
        ...endDate && {
          $lt: endDate
        }
      }
    });

    return logbooks
      // Map the values and transform cost into number
      .map(item => {
        return {
          driver: item.driver,
          vehicle: item.vehicleTyp,
          distance: +item.distance,
          distanceCost: +item.distanceCost,
          forFree: item.forFree
        };
      })
      // sum the cost for every driver
      .reduce((previousValue, currentValue) => {
        let existingDriver = previousValue.find(item => item.driver === currentValue.driver); // Check if driver already exists once in new array
        let payingDriver = currentValue.forFree ? previousValue.find(item => item.driver === Driver.CLAUDIA) : undefined;

        if (existingDriver) { // If driver already contains the array
          (payingDriver || existingDriver).distanceCost += currentValue.distanceCost;
          existingDriver.distance += currentValue.distance;
          if (payingDriver)
            payingDriver.drivesCostForFree += currentValue.distanceCost;

          if (!detailed)
            return previousValue;

          if (existingDriver.vehicles[currentValue.vehicle]) { // If vehicles contains the key of the vehicle keep going
            existingDriver.vehicles[currentValue.vehicle].distance += currentValue.distance;
            (payingDriver || existingDriver).vehicles[currentValue.vehicle].distanceCost += currentValue.distanceCost;
            if (payingDriver)
              payingDriver.vehicles[currentValue.vehicle].drivesCostForFree += currentValue.distanceCost;
          } else { // Else add the missing vehicle to the vehicles array including the already containing ones
            existingDriver.vehicles = {
              ...existingDriver.vehicles,
              [currentValue.vehicle]: {
                distance: currentValue.distance,
                distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost,
                ...(currentValue.forFree && existingDriver.driver === Driver.CLAUDIA) && {
                  drivesCostForFree: currentValue.distanceCost
                }
              }
            };
          }
        } else {
          previousValue.push({ // Declaration for each to avoid vehicle property
            driver: currentValue.driver,
            distance: currentValue.distance,
            distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost, // When there is a paying driver set the amount to 0
            ...detailed && {
              vehicles: {
                [currentValue.vehicle]: {
                  distance: currentValue.distance,
                  distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost
                }
              }
            }
          });
          if (currentValue.forFree) {
            previousValue.push({ // Declaration for each to avoid vehicle property
              driver: Driver.CLAUDIA,
              distance: 0,
              distanceCost: currentValue.distanceCost, // When there is a paying driver set the amount to 0
              drivesCostForFree: currentValue.distanceCost,
              ...detailed && {
                vehicles: {
                  [currentValue.vehicle]: {
                    distance: 0,
                    distanceCost: currentValue.distanceCost,
                    drivesCostForFree: currentValue.distanceCost
                  }
                }
              }
            });
          }
        } // Else add new value if not exist in Array vvv
        return previousValue;
      }, [] as { driver: Driver, distance: number, distanceCost: number, drivesCostForFree?: number, vehicles: { [vehicle: string]: { distance: number, distanceCost: number, drivesCostForFree?: number } } }[]); // This array ^^^
  }

  // <h1> TODO: Add exception handling for 404 of id </h1>
  async remove(_id: string) {
    await this.logbookModel.deleteOne({ _id: new Types.ObjectId(_id) }).exec();
  }

  // TODO: Add safety check for update task. Currently only managed with UI lock
  async update(id: string, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
    const distance = Number(+updateLogbookDto.newMileAge - +updateLogbookDto.currentMileAge).toFixed(2);
    const distanceCost = Number(+distance * 0.2).toFixed(2);

    return await this.logbookModel.findOneAndUpdate({
        _id: new Types.ObjectId(id)
      },
      {
        distance,
        distanceCost,
        ...updateLogbookDto
      },
      { new: true }
    ).exec();
  }

  async executeInvoice(createLogbookInvoiceDto: CreateLogbookInvoiceDto, drivers: DriverParameter[]): Promise<boolean> {
    const lastLogbookInvoiceDate = await this.logbookInvoiceModel.findOne().sort({ date: -1 }).exec();
    const invoiceStats = await this.calculateDriverStats(drivers, lastLogbookInvoiceDate.date, createLogbookInvoiceDto.endDate);

    await this.logbookInvoiceModel.create({ date: createLogbookInvoiceDto.endDate });

    const driverEmailStatsMap: Map<Driver, { email: string, sum: number }> = new Map<Driver, { email: string, sum: number }>();
    if (drivers.includes(Driver.ANDREA as DriverParameter)) {
      driverEmailStatsMap.set(Driver.ANDREA, { email: 'andrea@nuerkler.de', sum: invoiceStats.find(item => item.driver === Driver.ANDREA).distanceCost });
    } else if (drivers.includes(Driver.CLAUDIA as DriverParameter)) {
      driverEmailStatsMap.set(Driver.CLAUDIA, { email: 'claudia_dresden@icloud.de', sum: invoiceStats.find(item => item.driver === Driver.CLAUDIA).distanceCost });
    } else if (drivers.includes(Driver.OLIVER as DriverParameter)) {
      driverEmailStatsMap.set(Driver.OLIVER, { email: 'oliver_dresden@freenet.de', sum: invoiceStats.find(item => item.driver === Driver.OLIVER).distanceCost });
    } else if (drivers.includes(Driver.THOMAS as DriverParameter)) {
      driverEmailStatsMap.set(Driver.THOMAS, { email: 'thomas@nuerkler.de', sum: invoiceStats.find(item => item.driver === Driver.THOMAS).distanceCost });
    }
    driverEmailStatsMap.forEach((emailStats, driver) => {
      const invoiceParameter: InvoiceParameter = {
        email: emailStats.email,
        driver,
        startDate: lastLogbookInvoiceDate.date,
        endDate: new Date(createLogbookInvoiceDto.endDate)
      };
      this.sendInvoiceMail(invoiceParameter, emailStats.sum);
    });
    return true;
  }

  private async sendInvoiceMail(invoiceParameter: InvoiceParameter, sum: number = 0) {
    const mail: SendGrid.MailDataRequired = {
      to: invoiceParameter.email,
      from: 'Fahrtenbuch Abrechnung <abrechnung@nuerk-solutions.de>',
      templateId: 'd-6348c3dcdc9a4514b88efc4401c0299e',
      dynamicTemplateData: {
        startMonth: convertToMonth(invoiceParameter.startDate),
        endMonth: convertToMonth(invoiceParameter.endDate),
        person: invoiceParameter.driver,
        sum: sum.toLocaleString('de-DE', {maximumFractionDigits: 2, style: 'currency', currency: 'EUR'}),
        key: '1BF31DEB232411D1E3FABA4F911CA'
      }
    };
    await this._mailService.sendEmail(mail, true).catch(error => {
      throw new InternalServerErrorException(error, 'Failed to send mail!');
    });
  }
}
