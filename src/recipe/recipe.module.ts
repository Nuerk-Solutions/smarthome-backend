import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './core/schemas/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: Recipe.name,
          useFactory: () => RecipeSchema,
        },
      ],
      'logbook',
    ),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
