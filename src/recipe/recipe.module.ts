import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './core/schemas/recipe.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }], 'logbook')],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
