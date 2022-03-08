import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from '../recipe/core/schemas/recipe.schema';
import { YouTube, YouTubeSchema } from './schemas/youtube.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: YouTube.name,
          useFactory: () => YouTubeSchema,
        },
      ],
      'youtube',
    ),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
