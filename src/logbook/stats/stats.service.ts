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

//     async getAverageVehicleConsumption() {
//         const logbooks = await this._logbookService.findAll({
//             additionalInformationTyp: AdditionalInformationTyp.GETANKT,
//         });
//         const data = logbooks.data;
//         // const data = this.groupByVehicleAndMonth(logbooks.data);
//         // Gruppierung nach vehicle und Monaten
//         const groupedData = [];
//
//         data.forEach((entry) => {
//             const month = new Date(entry.date).toLocaleString('en-us', { month: 'long' });
//             const year = new Date(entry.date).getFullYear().toString();
//             const key = `${entry.vehicle}-${year}-${month}`;
//
//             let vehicleGroup = groupedData.find((group) => group.vehicle === entry.vehicle);
//
//             if (!vehicleGroup) {
//                 vehicleGroup = { vehicle: entry.vehicle, years: {} };
//                 groupedData.push(vehicleGroup);
//             }
//
//             if (!vehicleGroup.years[year]) {
//                 vehicleGroup.years[year] = {};
//             }
//
//             if (!vehicleGroup.years[year][key]) {
//                 vehicleGroup.years[year][key] = [];
//             }
//
//             if (
//                 entry.additionalInformation !== "" &&
//                 entry.distanceSinceLastAdditionalInformation !== "" &&
//                 parseFloat(entry.additionalInformation) !== 0 &&
//                 parseFloat(entry.distanceSinceLastAdditionalInformation) !== 0
//             ) {
//                 const consumption =
//                     parseFloat(entry.additionalInformation) /
//                     parseFloat(entry.distanceSinceLastAdditionalInformation);
//                 vehicleGroup.years[year][key].push(consumption * 100);
//             }
//         });
//
//         // Berechnung des Durchschnitts
//         groupedData.forEach((group) => {
//             Object.keys(group.years).forEach((year) => {
//                 Object.keys(group.years[year]).forEach((key) => {
//                     const consumptions = group.years[year][key];
//                     const averageConsumption =
//                         consumptions.reduce((sum, value) => sum + value, 0) / consumptions.length;
//
//                     group.years[year][key] = averageConsumption;
//                 });
//             });
//         });
//
// // Begrenzung auf maximal 12 Einträge pro Fahrzeug und Jahr
//         groupedData.forEach((group) => {
//             Object.keys(group.years).forEach((year) => {
//                 Object.keys(group.years[year]).forEach((key) => {
//                     if (group.years[year][key] === undefined || isNaN(group.years[year][key])) {
//                         delete group.years[year][key];
//                     }
//                 });
//
//                 const sortedMonths = Object.keys(group.years[year]).sort(
//                     (a, b) => new Date(a).getTime() - new Date(b).getTime()
//                 );
//
//                 if (sortedMonths.length > 12) {
//                     const monthsToDelete = sortedMonths.slice(0, sortedMonths.length - 12);
//                     monthsToDelete.forEach((month) => {
//                         delete group.years[year][month];
//                     });
//                 }
//             });
//         });
//         return groupedData;
//     }
//
//     groupByVehicleAndMonth(data: Logbook[]): Record<string, Record<string, Logbook[]>> {
//         const groupedData: Record<string, Record<string, Logbook[]>> = {};
//
//         data.forEach((data) => {
//             const vehiclee = data.vehicle;
//             const month = new Date(data.date).toLocaleString('default', {month: 'short'});
//
//             if (!groupedData[vehiclee]) {
//                 groupedData[vehiclee] = {};
//             }
//
//             if (!groupedData[vehiclee][month]) {
//                 groupedData[vehiclee][month] = [];
//             }
//
//             groupedData[vehiclee][month].push(data);
//         });
//
//         return groupedData;
//     }
//
//     async calculateVehicleStats(vehicles: VehicleParameter[], startDate?: Date, endDate?: Date) {
//         const paginateResult = await this._logbookService.findAll(
//             {
//                 vehicle: vehicles,
//                 date: {
//                     ...(startDate && {$gte: startDate}),
//                     ...(endDate && {$lte: endDate}),
//                 },
//             },
//             '+date',
//         );
//
//         const resultArray = paginateResult.data.reduce(
//             (result, item) => {
//                 const existingVehicle = result.find((v) => v.vehicle === item.vehicle);
//
//                 if (existingVehicle) {
//                     existingVehicle.distance += +item.distance;
//                     existingVehicle.distanceCost += +item.distanceCost;
//
//                     if (item.additionalInformationTyp === AdditionalInformationTyp.GETANKT && +item.distanceSinceLastAdditionalInformation !== 0) {
//                         existingVehicle.averageConsumptionSinceLastRefuel = (+item.additionalInformation / +item.distanceSinceLastAdditionalInformation) * 100;
//                         existingVehicle.averageCostPerKmSinceLastRefuel = +item.additionalInformationCost / +item.distanceSinceLastAdditionalInformation;
//                         existingVehicle.totalRefuels++;
//                         existingVehicle.averageCost += existingVehicle.averageCostPerKmSinceLastRefuel;
//                         existingVehicle.averageConsumption += existingVehicle.averageConsumptionSinceLastRefuel;
//                     } else if (item.additionalInformationTyp === AdditionalInformationTyp.GEWARTET && +item.distanceSinceLastAdditionalInformation !== 0 && +item.additionalInformationCost !== 0) {
//                         existingVehicle.totalMaintenanceCost += +item.additionalInformationCost;
//                         existingVehicle.totalMaintenancesDistance += +item.distanceSinceLastAdditionalInformation;
//                     }
//                 } else {
//                     result.push({
//                         vehicle: item.vehicle,
//                         distance: +item.distance,
//                         distanceCost: +item.distanceCost,
//                         averageConsumptionSinceLastRefuel: -1,
//                         averageCostPerKmSinceLastRefuel: -1,
//                         averageConsumption: 0,
//                         averageCost: 0,
//                         totalRefuels: 0,
//                         totalMaintenancesDistance: 0,
//                         totalMaintenanceCost: 0,
//                         averageMaintenanceCostPerKm: 0, // Default value for the new property
//                     });
//                 }
//
//                 return result;
//             },
//             [] as {
//                 vehicle: Vehicle;
//                 distance: number;
//                 distanceCost: number;
//                 averageConsumptionSinceLastRefuel: number;
//                 averageCostPerKmSinceLastRefuel: number;
//                 averageMaintenanceCostPerKm: number;
//                 averageConsumption: number;
//                 averageCost: number;
//                 totalRefuels: number;
//                 totalMaintenancesDistance: number;
//                 totalMaintenanceCost: number;
//             }[],
//         );
//
//         resultArray.forEach((currentValue) => {
//             currentValue.averageConsumption /= currentValue.totalRefuels;
//             currentValue.averageCost /= currentValue.totalRefuels;
//             currentValue.averageMaintenanceCostPerKm = currentValue.totalMaintenanceCost / currentValue.totalMaintenancesDistance;
//         });
//
//         return resultArray;
//     }

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
