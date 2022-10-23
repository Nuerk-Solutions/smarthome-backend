import { Document, FilterQuery, Model, SortOrder, Types, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    options: {
      sort?: string | { [key: string]: SortOrder | { $meta: 'textScore' } } | [string, SortOrder][] | undefined | null;
      limit?: number;
    } = {},
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        // Do not override the return values
        // The Projection defines which fields should be returned
        // See https://stackoverflow.com/a/66517835
        // _id: 0,
        // __v: 0,
        ...projection,
      })
      .sort(options.sort)
      .limit(options.limit)
      .exec();
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
    sort?: string | { [key: string]: SortOrder | { $meta: 'textScore' } } | [string, SortOrder][] | undefined | null,
  ): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery).sort(sort);
  }

  async findById(id: string): Promise<T | null> {
    return this.entityModel.findById(new Types.ObjectId(id)).exec();
  }

  async create(createEntityData: unknown): Promise<T> {
    return await this.entityModel.create(createEntityData);
  }

  async findOneAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, {
      new: true,
    });
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async deleteOneById(id: string): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteOne({ _id: new Types.ObjectId(id) });
    return deleteResult.deletedCount >= 1;
  }
}
