import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { Role } from '../authentication/core/enums/role.enum';
import { Recipe } from './schemas/recipe.schema';
import { RequestWithUserPayload } from '../authentication/core/interfaces/request-with-user-payload.interface';

@Authorization(Role.USER)
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Req() { user }: RequestWithUserPayload, @Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.create(createRecipeDto, user._id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeService.remove(+id);
  }
}
