import { EntityRepository } from './entity.repository';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { LogbookDocument } from '../logbook/core/schemas/logbook.schema';
import { VehicleTyp } from '../logbook/core/enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../logbook/core/enums/additional-information-typ.enum';

export abstract class LogbookEntityRepository<T extends LogbookDocument> extends EntityRepository<T> {
  constructor(readonly entityModel: Model<T>) {
    super(entityModel);
  }

  async findLastAddedLogbooks(): Promise<T[]> {
    return this.entityModel
      .aggregate([
        {
          $sort: {
            newMileAge: -1,
          },
        },
        {
          $group: {
            _id: '$vehicleTyp',
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
            vehicleTyp: 1,
          },
        },
      ])
      .collation({ locale: 'de', numericOrdering: true })
      .exec();
  }

  async findLastAddedLogbookForVehicle(vehicleTyp: VehicleTyp): Promise<T> {
    return this.entityModel
      .aggregate([
        {
          $sort: {
            newMileAge: -1,
          },
        },
        {
          $match: {
            vehicleTyp,
          },
        },
        {
          $limit: 1,
        },
      ])
      .collation({ locale: 'de', numericOrdering: true })
      .exec()
      .then((logbooks) => {
        if (logbooks != null && logbooks.length > 0) {
          return logbooks[0];
        }
        return null;
      });
  }

  async findLastAdditionalInformation(
    vehicleTyp: VehicleTyp,
    additionalInformationTyp: AdditionalInformationTyp,
  ): Promise<T[]> {
    return this.entityModel
      .aggregate([
        {
          $match: {
            vehicleTyp,
            additionalInformationTyp,
          },
        },
        {
          $sort: {
            newMileAge: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .collation({ locale: 'de', numericOrdering: true })
      .exec();
  }

  async getPagination(
    filterQuery: FilterQuery<T> = {},
    page: number = 0,
    limit: number = 100_000,
    sort: string | { [key: string]: SortOrder | { $meta: 'textScore' } } | [string, SortOrder][] | undefined | null = {
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

  /**
   * @deprecated The method should not be used
   */
  async findLastAddedLogbooksByMileage(): Promise<T[]> {
    const latestLogbookVw = await this.entityModel
      .findOne({ vehicleTyp: 'VW' })
      .sort({ newMileAge: -1 })
      .limit(1)
      .exec();
    const latestLogbookFerrari = await this.entityModel
      .findOne({ vehicleTyp: 'Ferrari' })
      .sort({ newMileAge: -1 })
      .limit(1)
      .exec();
    const latestLogbookPorsche = await this.entityModel
      .findOne({ vehicleTyp: 'Porsche' })
      .sort({ newMileAge: -1 })
      .limit(1)
      .exec();

    return [latestLogbookVw, latestLogbookFerrari, latestLogbookPorsche];
  }
}
