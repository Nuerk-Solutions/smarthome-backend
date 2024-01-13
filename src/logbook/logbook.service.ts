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
import {NewLogbook, Refuel} from "./core/schemas/logbook.schema";
import {Vehicle} from "./core/enums/vehicle-typ.enum";

@Injectable()
export class LogbookService {
    constructor(private readonly logbooksRepository: LogbooksRepository) {
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

        if (createLogbookDto.refuel) {
            const lastRefuel = await this.logbooksRepository.findLastRefuel(createLogbookDto.vehicle);
            let distanceDifference = 0;
            let consumption = 0;
            if (lastRefuel.length != 0) {
                distanceDifference = createLogbookDto.mileAge.new - lastRefuel[0].mileAge.new;
            }
            if (!createLogbookDto.refuel.isSpecial && distanceDifference != 0) {
                consumption = Math.round(createLogbookDto.refuel.liters / distanceDifference * 100 * 100) / 100;
            }
            submitLogbook = {
                ...submitLogbook, refuel: {
                    ...createLogbookDto.refuel,
                    distanceDifference, consumption,
                    ...(lastRefuel.length != 0 && {
                        previousRecordId: lastRefuel[0]._id,
                    }),
                }
            };
        }

        submitLogbook = {
            ...submitLogbook,
            mileAge: {
                ...submitLogbook.mileAge,
                difference,
                cost: Math.round((difference * DISTANCE_COST) * 100) / 100,
            }
        };

        return await this.logbooksRepository.create(submitLogbook);
    }

    async findAll(filter?: object, sort?: StringSortParameter, page?: number, limit?: number,): Promise<PaginateResult<NewLogbook>> {
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
                Fahrer: logbook.driver,
                Fahrzeug: logbook.vehicle,
                'Aktueller Kilometerstand': logbook.mileAge.current,
                'Neuer Kilometerstand': logbook.mileAge.new,
                Uebernommen: logbook.details.covered ? 'Ja' : 'Nein',
                Strecke: logbook.mileAge.difference,
                Kosten: logbook.mileAge.cost,
                Datum: logbook.date,
                Reiseziel: logbook.reason,
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

    // async migrate() {
    //     let count = 0;
    //     const logbooks = await this.findAll({});
    //     for (const logbook of logbooks.data.reverse()) {
    //         let refuel = null;
    //         if (logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT) {
    //             let consumption = parseFloat(logbook.additionalInformation) / parseFloat(logbook.distanceSinceLastAdditionalInformation) * 100;
    //             if (parseFloat(logbook.distanceSinceLastAdditionalInformation) === 0)
    //                 consumption = 0;
    //
    //             const previousRecord = await this.newLogbooksRepository.findLastRefuel(
    //                 logbook.vehicle,
    //             );
    //
    //             refuel = {
    //                 liters: Decimal128.fromString(parseFloat(logbook.additionalInformation).toFixed(2)),
    //                 price: Decimal128.fromString(parseFloat(logbook.additionalInformationCost || "0.00").toFixed(2)),
    //                 distanceDifference: Decimal128.fromString(parseFloat(logbook.distanceSinceLastAdditionalInformation).toFixed(2)),
    //                 consumption: Decimal128.fromString(consumption.toFixed(2)),
    //                 isSpecial: false,
    //                 ...(previousRecord.length != 0 && {
    //                     previousRecordId: previousRecord[0]._id,
    //                 })
    //             }
    //             console.log("Linked refuel with id: " + refuel.previousRecordId)
    //         }
    //
    //         let service = null;
    //         if (logbook.additionalInformationTyp === AdditionalInformationTyp.GEWARTET) {
    //             service = {
    //                 message: logbook.additionalInformation,
    //                 price: Decimal128.fromString(parseFloat(logbook.additionalInformationCost || "0.00").toFixed(2)),
    //             }
    //         }
    //
    //         const newLogbook = {
    //             _id: logbook._id,
    //             // @ts-ignore
    //             createdAt: logbook.createdAt,
    //             driver: logbook.driver,
    //             vehicle: logbook.vehicle,
    //             date: logbook.date,
    //             reason: logbook.reason,
    //             mileAge: {
    //                 current: parseInt(logbook.mileAge.current),
    //                 new: parseInt(logbook.mileAge.new),
    //                 difference: parseInt(logbook.distance),
    //                 unit: logbook.vehicle === Vehicle.MX5 ? Unit.MILE : Unit.KM,
    //                 cost: Decimal128.fromString(parseFloat(logbook.distanceCost).toFixed(2)),
    //             },
    //             details: {
    //                 covered: logbook.forFree, // Driver is added only if covered is true
    //                 ...logbook.forFree === true && {
    //                     driver: Driver.CLAUDIA
    //                 },
    //             },
    //             ...(logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT && {
    //                 refuel: refuel,
    //             }),
    //             ...(logbook.additionalInformationTyp === AdditionalInformationTyp.GEWARTET && {
    //                 service: service,
    //             })
    //         };
    //
    //         await this.newLogbooksRepository.create(newLogbook);
    //         count++;
    //         console.log("Migrated logbook #" + count + " with id: " + logbook._id + " successfully");
    //     }
    //     return true;
    // }
}
