import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRecipeDto } from './core/dto/create-recipe.dto';
import { UpdateRecipeDto } from './core/dto/update-recipe.dto';
import { Recipe, RecipeDocument } from './core/schemas/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private readonly _recipeModel: Model<RecipeDocument>
  ) {
  }

  async create(createRecipeDto: CreateRecipeDto, userId: Types.ObjectId): Promise<Recipe> {
    return await this._recipeModel.create({
      ...createRecipeDto,
      userId
    });
  }

  async findAll(userId: Types.ObjectId): Promise<Recipe[]> {
    return await this._recipeModel.find({ userId }).exec();
  }

  async findOne(userId: Types.ObjectId, id: Types.ObjectId): Promise<Recipe> {
    return await this._recipeModel
      .findOne({
        _id: id,
        userId
      })
      .exec();
  }

  // https://docs.mongodb.com/manual/reference/operator/update-array/
  async update(userId: Types.ObjectId, id: Types.ObjectId, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return await this._recipeModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updateRecipeDto,
        { new: true },
      )
      .exec();
  }

  async remove(userId: Types.ObjectId, id: Types.ObjectId): Promise<Recipe> {
    return await this._recipeModel
      .findOneAndRemove({
        userId,
        _id:
      })
      .exec();
  }
}
