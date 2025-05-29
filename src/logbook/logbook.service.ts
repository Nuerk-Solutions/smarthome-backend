import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as XLSX from 'xlsx';
import {VehicleParameter} from './core/dto/parameters/vehicle.parameter';
import {DriverParameter} from './core/dto/parameters/driver.parameter';
import {UpdateLogbookDto} from './core/dto/update-logbook.dto';
import {Types} from 'mongoose';
import {CreateLogbookDto} from './core/dto/create-logbook.dto';
import {DISTANCE_COST} from '../core/utils/constatns';
import {DateParameter} from "./core/dto/parameters/date.parameter";
import {LogbooksRepository} from "./repositories/logbooks.repository";
import { NewLogbook } from './core/schemas/logbook.schema';
import { VoucherService } from './voucher/voucher.service';

@Injectable()
export class LogbookService {
    constructor(
      private readonly logbooksRepository: LogbooksRepository, private readonly _voucherService: VoucherService) {
    }

    async create(createLogbookDto: CreateLogbookDto): Promise<NewLogbook> {
        let submitLogbook: any = {
            ...createLogbookDto,
        }
        const isContaining = await this.logbooksRepository.findOne({
            vehicle: createLogbookDto.vehicle, "mileAge.current": createLogbookDto.mileAge.current,
        });
        if (isContaining) {
            throw new BadRequestException('Logbook already exists');
        }

        const lastLogbook: NewLogbook = await this.logbooksRepository.findLastAddedLogbookForVehicle(createLogbookDto.vehicle);

        if (lastLogbook != null && createLogbookDto.mileAge.current != lastLogbook.mileAge.new) {
            throw new BadRequestException('mileAge.current is not equal to last logbook mileAge.new');
        }

        const difference = createLogbookDto.mileAge.new - createLogbookDto.mileAge.current;

        submitLogbook = {
            ...submitLogbook,
            mileAge: {
                ...submitLogbook.mileAge,
                difference,
                cost: Math.round((difference * DISTANCE_COST) * 100) / 100,
            }
        };

        if(createLogbookDto.details.voucher) {
            if(!await this._voucherService.isVoucherValid(createLogbookDto.details.voucher.code, true))
                throw new BadRequestException('Voucher is not valid');

          const voucher = await this._voucherService.getVoucherByCode(createLogbookDto.details.voucher.code);
          const remainingCoveredDistance= await this._voucherService.getRemainingCoveredDistance(voucher.code, difference);

          submitLogbook.details.voucher.usedValue = Math.round((remainingCoveredDistance * voucher.costPerKm) * 100) / 100;
          await this._voucherService.subtractDistance(createLogbookDto.details.voucher.code, remainingCoveredDistance);

            //if(remainingCoveredDistance == difference) {
                //submitLogbook.details.covered = true;
                //submitLogbook.details.driver = voucher.creator;
            //}
        }

        if (createLogbookDto.refuel) {
            let consumption = 0;
            let distanceDifference = 0;
            let previousRecordId = null;

            const refuelData = await this.logbooksRepository.findRefuelDataForConsumption(createLogbookDto.vehicle, createLogbookDto.mileAge.new);
            if (!createLogbookDto.refuel.isSpecial) {

                if (refuelData.length > 0 && refuelData[0].lastFullRefuel) {
                    distanceDifference = refuelData[0].distanceDifference;
                    previousRecordId = refuelData[0].lastFullRefuel._id;

                    // Addiere die aktuellen Liter zu den bereits summierten Litern
                    const totalLiters = refuelData[0].totalLitersSinceLast + createLogbookDto.refuel.liters;
                    console.log(refuelData)
                    console.log(totalLiters, refuelData[0].totalLitersSinceLast, createLogbookDto.refuel.liters);

                    if (distanceDifference > 0) {
                        consumption = Math.round(totalLiters / distanceDifference * 100 * 100) / 100;
                    }
                }
            }

            submitLogbook = {
                ...submitLogbook,
                refuel: {
                    ...createLogbookDto.refuel,
                    distanceDifference,
                    consumption,
                    ...(previousRecordId && { previousRecordId }),
                }
            };
        }


        return await this.logbooksRepository.create(submitLogbook);
    }

    async findAll(filter?: object, sort?: StringSortParameter, page?: number, limit?: number): Promise<PaginateResult<NewLogbook>> {
        return await this.logbooksRepository.getPagination(filter, page, limit, sort);
    }

    async findOne(id: string): Promise<NewLogbook> {
        return await this.logbooksRepository.findById(id);
    }

    async findLatest(): Promise<NewLogbook[]> {
        return this.logbooksRepository.findLastAddedLogbooks();
    }

    async findLastRefuels(limit: number): Promise<NewLogbook[]> {
        return await this.logbooksRepository.findLastRefuels(limit);
    }

    async download(drivers: DriverParameter[], vehicles: VehicleParameter[], date: DateParameter,): Promise<Buffer> {
        const logbooks = await this.logbooksRepository.find({
            vehicle: vehicles, driver: drivers, date: {
                ...(date.startDate && {
                    $gte: date.startDate,
                }), ...(date.endDate && {
                    $lte: date.endDate,
                }),
            },
        }, {date: 1},);

        if (!logbooks.length) {
            throw new NotFoundException('No logbooks found');
        }

        const data = logbooks.map((logbook) => {
            return {
                Record_Id: logbook.id,
                Fahrer: logbook.driver,
                Fahrzeug: logbook.vehicle,
                'Aktueller Kilometerstand': logbook.mileAge.current,
                'Neuer Kilometerstand': logbook.mileAge.new,
                Uebernommen: logbook.details.covered ? 'Ja' : 'Nein',
                Strecke: logbook.mileAge.difference,
                Kosten: logbook.mileAge.cost,
                Datum: logbook.date,
                Reiseziel: logbook.reason,
                Getankt: logbook.refuel == null ? "Nein" : "Ja",
                Getankt_Liter: logbook.refuel == null ? null : logbook.refuel.liters,
                Getankt_Preis: logbook.refuel == null ? null : logbook.refuel.price,
                Getankt_Verbrauch: logbook.refuel == null ? null : logbook.refuel.consumption,
                Getankt_Keine_Volltankung: logbook.refuel ? "Ja" : "Nein",
                Getankt_Entfernung: logbook.refuel == null ? null : logbook.refuel.distanceDifference,
                Getankt_Prev_Record_Id: logbook.refuel == null ? null : logbook.refuel.previousRecordId,
                Gewartet_Preis: logbook.service == null ? null : logbook.service.price,
                Gewartet_Nachricht: logbook.service == null ? null : logbook.service.message,
            };
        });

        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, 'Fahrtenbuch');
        // Generate buffer
        return XLSX.write(workBook, {
            bookType: 'xlsx', type: 'buffer',
        });
    }

    //
    // // <h1> TODO: Add exception handling for 404 of id </h1>
    async remove(_id: string): Promise<boolean> {
        return await this.logbooksRepository.deleteOneById(_id);
    }

    async update(id: string, updateLogbookDto: UpdateLogbookDto): Promise<NewLogbook> {
        const targetLogbook = await this.logbooksRepository.findById(id);

        if (targetLogbook == null) {
            throw new NotFoundException('Logbook not found');
        }
        const distance = updateLogbookDto.mileAge.new - targetLogbook.mileAge.current;

        const lastAddedLogbook = await this.logbooksRepository.findLastAddedLogbookForVehicle(targetLogbook.vehicle);
        if (lastAddedLogbook == null) {
            throw new NotFoundException('No valid last added logbook found');
        }

        if (lastAddedLogbook._id.toString() !== targetLogbook._id.toString()) {
            console.log('Logbook is not the last added logbook');
            console.log("Removing newMilAge and mileAge.current from updateLogbookDto because it's not the last added logbook",);
            delete updateLogbookDto.mileAge.new;
            return await this.logbooksRepository.findOneAndUpdate({
                _id: new Types.ObjectId(id),
            }, updateLogbookDto,);
        }

        return await this.logbooksRepository.findOneAndUpdate({
            _id: new Types.ObjectId(id),
        }, {
            mileAge: {
                difference: distance, cost: distance * DISTANCE_COST,
            }, ...updateLogbookDto,
        },);
    }
}
