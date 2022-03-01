import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { Role } from '../authentication/core/enums/role.enum';
import { Recipe } from './schemas/recipe.schema';
import { RequestWithUserPayload } from '../authentication/core/interfaces/request-with-user-payload.interface';
import { Types } from 'mongoose';
import { NoRecipeFoundException } from './exceptions/no-recipe-found.exception';
import { IdRecipeDto } from './dto/id-recipe.dto';

@Authorization(Role.USER)
@Controller('recipe')
export class RecipeController {
  constructor(private readonly _recipeService: RecipeService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Req() { user }: RequestWithUserPayload, @Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this._recipeService.create(createRecipeDto, user._id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Req() { user }: RequestWithUserPayload): Promise<Recipe[]> {
    return await this._recipeService.findAll(user._id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Req() { user }: RequestWithUserPayload, @Param() idRecipeDto: IdRecipeDto): Promise<Recipe> {
    const objectId = new Types.ObjectId(idRecipeDto.id);
    const recipe = await this._recipeService.findOne(user._id, objectId);

    if (!recipe) {
      throw new NoRecipeFoundException();
    }
    return recipe;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Req() { user }: RequestWithUserPayload,
    @Param() idRecipeDto: IdRecipeDto,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const objectId = new Types.ObjectId(idRecipeDto.id);
    return await this._recipeService.update(user._id, objectId, updateRecipeDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Req() { user }: RequestWithUserPayload, @Param() idRecipeDto: IdRecipeDto): Promise<Recipe> {
    const objectId = new Types.ObjectId(idRecipeDto.id);
    return await this._recipeService.remove(user._id, objectId);
  }
}
