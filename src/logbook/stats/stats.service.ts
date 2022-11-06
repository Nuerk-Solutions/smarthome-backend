import { Injectable } from '@nestjs/common';
import { VehicleParameter } from '../core/dto/parameters/vehicle.parameter';
import { Logbook } from '../core/schemas/logbook.schema';
import { AdditionalInformationTyp } from '../core/enums/additional-information-typ.enum';
import { VehicleTyp } from '../core/enums/vehicle-typ.enum';
import { DriverParameter } from '../core/dto/parameters/driver.parameter';
import { Driver } from '../core/enums/driver.enum';
import { LogbookService } from '../logbook.service';

@Injectable()
export class StatsService {
  constructor(private readonly _logbookService: LogbookService) {}

  async calculateVehicleStats(vehicles: VehicleParameter[], startDate?: Date, endDate?: Date) {
    const paginateResult: PaginateResult<Logbook> = await this._logbookService.findAll(
      {
        vehicleTyp: vehicles,
        date: {
          ...(startDate && {
            $gte: startDate,
          }),
          ...(endDate && {
            $lte: endDate,
          }),
        },
      },
      '+date',
    ); //NOTE: Sort need to be ASC in order to calculate the average consumption correctly

    return paginateResult.data
      .map((item) => {
        return {
          ...vehicles,
          vehicle: item.vehicleTyp,
          distance: +item.distance,
          desc: item.driveReason,
          distanceCost: +item.distanceCost,
          additionalInformation: item.additionalInformation,
          additionalInformationTyp: item.additionalInformationTyp,
          additionalInformationCost: item.additionalInformationCost,
          distanceSinceLastAdditionalInformation: item.distanceSinceLastAdditionalInformation,
        };
      })
      .reduce((resultArray, currentValue) => {
        const existingVehicle = resultArray.find((item) => item.vehicle === currentValue.vehicle);

        if (existingVehicle) {
          existingVehicle.distance += currentValue.distance;
          existingVehicle.distanceCost += currentValue.distanceCost;
          if (
            currentValue.additionalInformationTyp == AdditionalInformationTyp.GETANKT &&
            +currentValue.distanceSinceLastAdditionalInformation !== 0
          ) {
            existingVehicle.averageConsumptionSinceLastRefuel =
              (+currentValue.additionalInformation / +currentValue.distanceSinceLastAdditionalInformation) * 100;
            existingVehicle.averageCostPerKmSinceLastRefuel =
              +currentValue.additionalInformationCost / +currentValue.distanceSinceLastAdditionalInformation;
            existingVehicle.totalRefuels++;
            existingVehicle.averageCost += existingVehicle.averageCostPerKmSinceLastRefuel;
            existingVehicle.averageConsumption += existingVehicle.averageConsumptionSinceLastRefuel;
          } else if (
            currentValue.additionalInformationTyp === AdditionalInformationTyp.GEWARTET &&
            +currentValue.distanceSinceLastAdditionalInformation !== 0 &&
            +currentValue.additionalInformationCost !== 0
          ) {
            existingVehicle.totalMaintenanceCost += +currentValue.additionalInformationCost;
            existingVehicle.totalMaintenancesDistance += +currentValue.distanceSinceLastAdditionalInformation;
          }
        } else {
          resultArray.push({
            vehicle: currentValue.vehicle,
            distance: currentValue.distance,
            distanceCost: currentValue.distanceCost,
            averageConsumptionSinceLastRefuel: -1,
            averageCostPerKmSinceLastRefuel: -1,
            averageConsumption: 0,
            averageCost: 0,
            totalRefuels: 0,
            totalMaintenancesDistance: 0,
            totalMaintenanceCost: 0,
          });
        }
        return resultArray;
      }, [] as { vehicle: VehicleTyp; distance: number; distanceCost: number; averageConsumptionSinceLastRefuel: number; averageCostPerKmSinceLastRefuel: number; averageConsumption: number; averageCost: number; totalRefuels: number; totalMaintenancesDistance: number; totalMaintenanceCost: number }[])
      .reduce((resultArray, currentValue) => {
        resultArray.push({
          ...currentValue,
          averageConsumption: currentValue.averageConsumption / currentValue.totalRefuels,
          averageCost: currentValue.averageCost / currentValue.totalRefuels,
          averageMaintenanceCostPerKm: currentValue.totalMaintenanceCost / currentValue.totalMaintenancesDistance,
        });

        return resultArray;
      }, [] as { vehicle: VehicleTyp; distance: number; distanceCost: number; averageConsumptionSinceLastRefuel: number; averageCostPerKmSinceLastRefuel: number; averageConsumption: number; averageCost: number; totalRefuels: number; averageMaintenanceCostPerKm: number }[]);
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
      vehicles: [{ vehicleTyp: VehicleTyp; distance: number; distanceCost: number; drivesCostForFree?: number }];
    }[]
  > {
    const paginateResult: PaginateResult<Logbook> = await this._logbookService.findAll({
      vehicleTyp: vehicles || Object.values(VehicleTyp),
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
            vehicle: item.vehicleTyp,
            distance: +item.distance,
            distanceCost: +item.distanceCost,
            forFree: item.forFree,
          };
        })
        // sum the cost for every driver
        .reduce((previousValue, currentValue) => {
          let existingDriver = previousValue.find((item) => item.driver === currentValue.driver); // Check if driver already exists once in new array

          // @ts-ignore
          if (currentValue.forFree && drivers.includes(Driver.CLAUDIA)) {
            // TODO: May add individual paying drivers and display them
            let payingDriver = previousValue.find((item) => item.driver === Driver.CLAUDIA);

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
                      vehicleTyp: currentValue.vehicle,
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
                const vehicle = payingDriver.vehicles.find((item) => item.vehicleTyp === currentValue.vehicle);
                vehicle.drivesCostForFree = (vehicle.drivesCostForFree || 0) + currentValue.distanceCost;
              }
            }
          }

          if (existingDriver) {
            // If driver already contains the array
            existingDriver.distanceCost += currentValue.forFree ? 0 : currentValue.distanceCost;
            existingDriver.distance += currentValue.distance;

            if (!detailed) return previousValue;

            let existingVehicle = existingDriver.vehicles.find((item) => item.vehicleTyp === currentValue.vehicle);
            if (existingVehicle) {
              // If vehicles contains the key of the vehicle keep going
              existingVehicle.distance += currentValue.distance;
              existingVehicle.distanceCost += currentValue.forFree ? 0 : currentValue.distanceCost;
            } else {
              // Else add the missing vehicle to the vehicles array including the already containing ones
              existingDriver.vehicles.push({
                vehicleTyp: currentValue.vehicle,
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
                    vehicleTyp: currentValue.vehicle,
                    distance: currentValue.distance,
                    distanceCost: currentValue.forFree ? 0 : currentValue.distanceCost,
                  },
                ],
              }),
            });
          } // Else add new value if not exist in Array vvv
          return previousValue;
        }, [] as { driver: Driver; distance: number; distanceCost: number; drivesCostForFree?: number; vehicles: [{ vehicleTyp: VehicleTyp; distance: number; distanceCost: number; drivesCostForFree?: number }] }[])
    ); // This array ^^^
  }
}
