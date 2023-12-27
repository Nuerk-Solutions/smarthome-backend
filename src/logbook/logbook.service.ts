import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as XLSX from 'xlsx';
import {Logbook} from './core/schemas/logbook.schema';
import {AdditionalInformationTyp} from './core/enums/additional-information-typ.enum';
import {VehicleParameter} from './core/dto/parameters/vehicle.parameter';
import {DriverParameter} from './core/dto/parameters/driver.parameter';
import {LogbooksRepository} from './repositories/logbooks.repository';
import {UpdateLogbookDto} from './core/dto/update-logbook.dto';
import {Types} from 'mongoose';
import {CreateLogbookDto} from './core/dto/create-logbook.dto';
import {DISTANCE_COST} from '../core/utils/constatns';
import e from "express";
import {DateParameter} from "./core/dto/parameters/date.parameter";
import {Driver} from "./core/enums/driver.enum";
import {NewLogbookRepository} from "./repositories/newLogbook.repository";
import {NewLogbook} from "./core/schemas/newLogbook.schema";
import {Decimal128, Double} from "bson";

@Injectable()
export class LogbookService {
    constructor(private readonly logbooksRepository: LogbooksRepository, private readonly newLogbooksRepository: NewLogbookRepository) {
    }

    async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
        const isContaining = await this.logbooksRepository.findOne({
            vehicleTyp: createLogbookDto.vehicleTyp,
            currentMileAge: createLogbookDto.currentMileAge,
        });
        if (isContaining) {
            throw new BadRequestException('Logbook already exists');
        }

        const lastLogbook: Logbook = await this.logbooksRepository.findLastAddedLogbookForVehicle(
            createLogbookDto.vehicleTyp,
        );

        if (lastLogbook != null && +createLogbookDto.currentMileAge != +lastLogbook.newMileAge) {
            throw new BadRequestException('CurrentMileAge is not equal to last logbook newMileAge');
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

    async findAll(
        filter?: object,
        sort?: StringSortParameter,
        page?: number,
        limit?: number,
    ): Promise<PaginateResult<Logbook>> {
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
        date: DateParameter,
    ): Promise<Buffer> {
        const logbooks = await this.logbooksRepository.find(
            {
                vehicleTyp: vehicles,
                driver: drivers,
                date: {
                    ...(date.startDate && {
                        $gte: date.startDate,
                    }),
                    ...(date.endDate && {
                        $lte: date.endDate,
                    }),
                },
            },
            {date: 1},
        );

        if (!logbooks.length) {
            throw new NotFoundException('No logbooks found');
        }

        const data = logbooks.map((logbook) => {
            // eslint-disable-next-line max-len
            // Calculate average consumption per 100km using additionalInformation as fuel and distanceSinceLastAdditionalInformation as distance
            let fuelConsumption: string;
            if (
                logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT &&
                +logbook.distanceSinceLastAdditionalInformation !== 0
            ) {
                fuelConsumption = Number(
                    (Number(logbook.additionalInformation) / Number(logbook.distanceSinceLastAdditionalInformation)) * 100,
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
        if (lastAddedLogbook == null) {
            throw new NotFoundException('No valid last added logbook found');
        }

        if (lastAddedLogbook._id.toString() !== targetLogbook._id.toString()) {
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

    async migrate() {
        let count = 0;
        const logbooks = await this.findAll({});
        for (const logbook of logbooks.data.reverse()) {
            let refuel = null;
            if (logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT) {
                let consumption = parseFloat(logbook.additionalInformation) / parseFloat(logbook.distanceSinceLastAdditionalInformation) * 100;
                if (parseFloat(logbook.distanceSinceLastAdditionalInformation) === 0)
                    consumption = 0;

                const previousRecord = await this.newLogbooksRepository.findLastRefuel(
                    logbook.vehicleTyp,
                );

                refuel = {
                    liters: Decimal128.fromString(parseFloat(logbook.additionalInformation).toFixed(2)),
                    price: Decimal128.fromString(parseFloat(logbook.additionalInformationCost || "0.00").toFixed(2)),
                    distanceDifference: Decimal128.fromString(parseFloat(logbook.distanceSinceLastAdditionalInformation).toFixed(2)),
                    consumption: Decimal128.fromString(consumption.toFixed(2)),
                    isSpecial: false,
                    ...(previousRecord.length != 0 && {
                        previousRecordId: previousRecord[0]._id,
                    })
                }
                console.log("Linked refuel with id: " + refuel.previousRecordId)
            }

            let service = null;
            if (logbook.additionalInformationTyp === AdditionalInformationTyp.GEWARTET) {
                service = {
                    message: logbook.additionalInformation,
                    price: Decimal128.fromString(parseFloat(logbook.additionalInformationCost || "0.00").toFixed(2)),
                }
            }

            const newLogbook = {
                _id: logbook._id,
                // @ts-ignore
                createdAt: logbook.createdAt,
                driver: logbook.driver,
                vehicle: logbook.vehicleTyp,
                date: logbook.date,
                reason: logbook.driveReason,
                mileAge: {
                    current: parseInt(logbook.currentMileAge),
                    new: parseInt(logbook.newMileAge),
                    difference: parseInt(logbook.distance),
                    cost: Decimal128.fromString(parseFloat(logbook.distanceCost).toFixed(2)),
                },
                details: {
                    covered: logbook.forFree, // Driver is added only if covered is true
                    ...logbook.forFree === true && {
                        driver: Driver.CLAUDIA
                    },
                },
                ...(logbook.additionalInformationTyp === AdditionalInformationTyp.GETANKT && {
                    refuel: refuel,
                }),
                ...(logbook.additionalInformationTyp === AdditionalInformationTyp.GEWARTET && {
                    service: service,
                })
            };

            await this.newLogbooksRepository.create(newLogbook);
            count++;
            console.log("Migrated logbook #" + count + " with id: " + logbook._id + " successfully");
        }
        return true;
    }
}
