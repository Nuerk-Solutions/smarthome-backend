import {Injectable} from '@nestjs/common';
import {VehicleParameter} from '../core/dto/parameters/vehicle.parameter';
import {NewLogbook} from '../core/schemas/logbook.schema';
import {AdditionalInformationTyp} from '../core/enums/additional-information-typ.enum';
import {Vehicle} from '../core/enums/vehicle-typ.enum';
import {DriverParameter} from '../core/dto/parameters/driver.parameter';
import {Driver} from '../core/enums/driver.enum';
import {LogbookService} from '../logbook.service';

@Injectable()
export class StatsService {
    constructor(private readonly _logbookService: LogbookService) {
    }

    /**
     *
     * @param startDate Is the date from which to start count
     * @param endDate
     * @param drivers All drivers that should be displayed in the output
     * @param vehicles All vehicles that should be displayed in the output
     * @param detailed Detailed information to every driver
     */
    async calculateDriverStats(
        drivers: DriverParameter[] | Driver[],
        startDate?: Date,
        endDate?: Date,
        vehicles?: VehicleParameter[],
        detailed: boolean = true,
    ): Promise<
        {
            driver: Driver;
            distance: number;
            distanceCost: number;
            drivesCostForFree?: number;
            vehicles: [{ vehicle: Vehicle; distance: number; distanceCost: number; drivesCostForFree?: number }];
        }[]
    > {
        const paginateResult: PaginateResult<NewLogbook> = await this._logbookService.findAll({
            vehicle: vehicles || Object.values(Vehicle),
            driver: drivers,
            date: {
                ...(startDate && {
                    $gte: startDate,
                }),
                ...(endDate && {
                    $lte: endDate,
                }),
            },
        });

        return (
            paginateResult.data
                // Map the values and transform cost into number
                .map((item) => {
                    return {
                        driver: item.driver,
                        vehicle: item.vehicle,
                        distance: item.mileAge.difference,
                        distanceCost: item.mileAge.cost,
                        forFree: item.details.covered,
                    };
                })
                // sum the cost for every driver
                .reduce((previousValue, currentValue) => {
                    let existingDriver = previousValue.find((item) => item.driver === currentValue.driver); // Check if driver already exists once in new array

                    if (currentValue.forFree && drivers.includes(Driver.CLAUDIA)) {
                        // TODO: May add individual paying drivers and display them
                        let payingDriver = previousValue.find((item) => item.driver === Driver.CLAUDIA); // Find previous entry to check if there are already costs for this driver

                        if (!payingDriver) {
                            previousValue.push({
                                // Declaration for each to avoid vehicle property
                                driver: Driver.CLAUDIA,
                                distance: 0,
                                distanceCost: currentValue.distanceCost, // When there is a paying driver set the amount to 0
                                drivesCostForFree: currentValue.distanceCost,
                                ...(detailed && {
                                    vehicles: [
                                        {
                                            vehicle: currentValue.vehicle,
                                            distance: 0,
                                            distanceCost: currentValue.distanceCost,
                                            drivesCostForFree: currentValue.distanceCost,
                                        },
                                    ],
                                }),
                            });
                        } else {
                            payingDriver.drivesCostForFree = (payingDriver.drivesCostForFree || 0) + currentValue.distanceCost;
                            if (detailed) {
                                const vehicle = payingDriver.vehicles.find((item) => item.vehicle === currentValue.vehicle);
                                if (vehicle != undefined) {
                                    vehicle.drivesCostForFree = (vehicle.drivesCostForFree || 0) + currentValue.distanceCost;
                                }
                            }
                        }
                    }

                    if (existingDriver) {
                        // If driver already contains the array
                        existingDriver.distanceCost += currentValue.forFree ? 0 : currentValue.distanceCost;
                        existingDriver.distance += currentValue.distance;

                        if (!detailed) return previousValue;

                        let existingVehicle = existingDriver.vehicles.find((item) => item.vehicle === currentValue.vehicle);
                        if (existingVehicle) {
                            // If vehicles contains the key of the vehicle keep going
                            existingVehicle.distance += currentValue.distance;
                            existingVehicle.distanceCost += currentValue.forFree ? 0 : currentValue.distanceCost;
                        } else {
                            // Else add the missing vehicle to the vehicles array including the already containing ones
                            existingDriver.vehicles.push({
                                vehicle: currentValue.vehicle,
                                distance: currentValue.distance,
                                distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost,
                            });
                        }
                    } else {
                        previousValue.push({
                            // Declaration for each to avoid vehicle property
                            driver: currentValue.driver,
                            distance: currentValue.distance,
                            distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost, // When there is a paying driver set the amount to 0
                            ...(detailed && {
                                vehicles: [
                                    {
                                        vehicle: currentValue.vehicle,
                                        distance: currentValue.distance,
                                        distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost,
                                    },
                                ],
                            }),
                        });
                    } // Else add new value if not exist in Array vvv
                    return previousValue;
                }, [] as {
                    driver: Driver;
                    distance: number;
                    distanceCost: number;
                    drivesCostForFree?: number;
                    vehicles: [{
                        vehicle: Vehicle;
                        distance: number;
                        distanceCost: number;
                        drivesCostForFree?: number
                    }]
                }[])
        ); // This array ^^^
    }
}
