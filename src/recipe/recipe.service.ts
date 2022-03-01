import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private readonly _recipeModel: Model<RecipeDocument>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, userId: Types.ObjectId): Promise<Recipe> {
    return await this._recipeModel.create({
      ...createRecipeDto,
      userId: userId,
    });
  }

  async findAll(userId: Types.ObjectId): Promise<Recipe[]> {
    return await this._recipeModel.find({ userId: userId }).exec();
  }

  async findOne(userId: Types.ObjectId, id: Types.ObjectId): Promise<Recipe> {
    return await this._recipeModel
      .findOne({
        _id: id,
        userId: userId,
      })
      .exec();
  }

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
        userId: userId,
        _id: d,
      })
      .exec();
  }
}
