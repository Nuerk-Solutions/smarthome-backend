import {EntityRepository} from './entity.repository';
import { FilterQuery, Model, Schema, SortOrder } from 'mongoose';
import {Vehicle} from '../logbook/core/enums/vehicle-typ.enum';
import {LogbookDocument} from "../logbook/core/schemas/logbook.schema";
import { Driver } from '../logbook/core/enums/driver.enum';
import { DriverParameter } from '../logbook/core/dto/parameters/driver.parameter';

export abstract class LogbookEntityRepository<T extends LogbookDocument> extends EntityRepository<T> {
    constructor(readonly entityModel: Model<T>) {
        super(entityModel);
    }

    async findLastAddedLogbooks(): Promise<T[]> {
        return this.entityModel
            .aggregate([
                {
                    $sort: {
                        "mileAge.new": -1,
                    },
                },
                {
                    $group: {
                        _id: '$vehicle',
                        lastLogbook: {
                            $first: '$$ROOT',
                        },
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: '$lastLogbook',
                    },
                },
                {
                    $sort: {
                        vehicle: 1,
                    },
                },
            ])
            .collation({locale: 'de', numericOrdering: true})
            .exec();
    }

    async findLastRefuel(
        vehicle: Vehicle
    ): Promise<T[]> {
        return this.entityModel
            .aggregate([
                {
                    $match: {
                        vehicle: vehicle,
                        refuel: {
                            $exists: true,
                        },
                    },
                },
                {
                    $sort: {
                        "mileAge.new": -1,
                    },
                },
                {
                    $limit: 1,
                },
            ])
            .collation({ locale: 'de', numericOrdering: true })
            .exec();
    }

    /*
    Used for statistics page in the app
     */
    async findLastRefuels(limit: number): Promise<T[]> {
        return this.entityModel.aggregate(
            [
                    {
                        $match: {
                            'refuel': {
                                $exists: true,
                            },
                        },
                    },
                    {
                        $sort: {
                            'mileAge.new': -1,
                        },
                    },
                    {
                        $group: {
                            _id: "$vehicle",
                            entries: {
                                $push: "$$ROOT"
                            }
                        }
                    },
                    {
                        $project: {
                            entries: {
                                $slice: ["$entries", limit ?? 10]
                            }
                        }
                    },
                    {
                        $unwind: "$entries"
                    },
                    {
                        $replaceRoot: { newRoot: "$entries" }
                    }
            ])
            .collation({ locale: 'de', numericOrdering: true })
            .exec();
    }

    async getDriverStats(drivers: DriverParameter[] | Driver[], startDate: Date = new Date(0), endDate: Date = new Date()): Promise<DriverStats[]> {
      return this.entityModel.aggregate(
        [
          {
            $match: {
              date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              }
            }
          },
          // Group by driver and vehicle, calculate total distance and distanceCost for each vehicle
          {
            $group: {
              _id: { driver: "$driver", vehicle: "$vehicle" },
              distance: { $sum: "$mileAge.difference" },
              cost: {
                $sum: {
                  $cond: {
                    if: "$details.covered",
                    then: 0,
                    else: "$mileAge.cost"
                  }
                }
              }
            }
          },

          // Group by driver, calculate total distance and distanceCost for all vehicles
          {
            $group: {
              _id: "$_id.driver",
              totalDistance: { $sum: "$distance" },
              totalCost: { $sum: "$cost" },
              vehicles: {
                $push: {
                  vehicle: "$_id.vehicle",
                  distance: "$distance",
                  cost: "$cost"
                }
              }
            }
          },

          // Filter the result based on specific drivers (e.g., Andrea and Thomas)
          {
            $match: {
              _id: { $in: drivers }
            }
          },

          // Project the final structure
          {
            $project: {
              _id: 0,
              driver: "$_id",
              totalDistance: 1,
              totalCost: 1,
              vehicles: 1
            }
          }
        ])
        .collation({ locale: 'de', numericOrdering: true })
        .exec();
    }

    async findLastAddedLogbookForVehicle(vehicle: Vehicle): Promise<T> {
        return this.entityModel
            .aggregate([
                {
                    $sort: {
                        "mileAge.new": -1,
                    },
                },
                {
                    $match: {
                        vehicle,
                    },
                },
                {
                    $limit: 1,
                },
            ])
            .collation({locale: 'de', numericOrdering: true})
            .exec()
            .then((logbooks) => {
                if (logbooks != null && logbooks.length > 0) {
                    return logbooks[0];
                }
                return null;
            });
    }

    async getPagination(
        filterQuery: FilterQuery<T> = {},
        page: number = 0,
        limit: number = 100_000,
        sort: string | {
            [key: string]: SortOrder | { $meta: 'textScore' }
        } | [string, SortOrder][] | undefined | null = {
            date: -1,
        },
    ): Promise<PaginateResult<T>> {
        const total = await this.entityModel.countDocuments(filterQuery).exec();
        // eslint-disable-next-line max-len
        limit = limit <= 0 || limit >= total ? total : limit; // the limit can be not greater than the total (e.g. @param) and must be minimum 1
        page = page < 0 ? 1 : page; // the page cannot be negative be must be minimum 1

        const data = await this.entityModel
            .find(filterQuery)
            .sort(sort)
            .skip(page * limit >= total ? total - limit : page * limit)
            .limit(limit)
            .exec();

        return {
            data: data,
            total,
            length: data.length,
            limit,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
}
