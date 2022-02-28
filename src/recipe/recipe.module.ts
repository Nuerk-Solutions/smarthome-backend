import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
