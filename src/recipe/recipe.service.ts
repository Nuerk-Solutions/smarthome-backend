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
    const recipe = this._recipeModel.create({
      ...createRecipeDto,
      userId: userId,
    });
    return recipe;
  }

  findAll() {
    return `This action returns all recipe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
