import { EntityRepository } from './entity.repository';
import { Aggregate, Model } from 'mongoose';
import { LogbookDocument } from '../logbook/core/schemas/logbook.schema';

export abstract class LogbookEntityRepository<T extends LogbookDocument> extends EntityRepository<T> {
  constructor(protected readonly entityModel: Model<T>) {
    super(entityModel);
  }

  async findLastAddedLogbook(): Promise<T[]> {
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
      ])
      .exec();
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

  async findLastAddedLogbooksForEachVehicleType(): Promise<Aggregate<Array<T>>> {
    return await this.entityModel
      .aggregate([
        {
          $group: {
            _id: '$vehicleTyp',
            lastLogbook: {
              $last: '$$ROOT',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$lastLogbook',
          },
        },
      ])
      .exec();
  }
}
