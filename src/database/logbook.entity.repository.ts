import {EntityRepository} from './entity.repository';
import {FilterQuery, Model, SortOrder} from 'mongoose';
import {Vehicle} from '../logbook/core/enums/vehicle-typ.enum';
import {LogbookDocument, Refuel} from "../logbook/core/schemas/logbook.schema";

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

    async findLastRefuels(limit: number): Promise<Array<{vehicle: Vehicle, refuels: Refuel[]}>> {
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
                        _id: '$vehicle',
                        refuels: {
                            $push: {
                                date: '$date',
                                refuel: '$refuel',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        vehicle: '$_id',
                        refuels: { $slice: ['$refuels', limit] },
                    },
                },
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
        limit = limit <= 0 || limit >= total ? total : limit; // the limit can be not greater than the total (e.g @param) and must be minimum 1
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
