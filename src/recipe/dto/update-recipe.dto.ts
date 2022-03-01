import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Time } from '../schemas/time.schema';
import { Ingredient } from '../schemas/ingredient.schema';
import { Direction } from '../schemas/direction.schema';
import { Category } from '../core/enums/category.enum';

export class UpdateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(600)
  description: string;

  @IsNotEmpty()
  @Type(() => Time)
  preparationTime: Time;

  @IsNotEmpty()
  @Type(() => Time)
  cookingTime: Time;

  @IsNotEmpty()
  @Type(() => Ingredient)
  ingredients: Ingredient[];

  @IsNotEmpty()
  @Type(() => Direction)
  directions: Direction[];

  @IsNotEmpty()
  @IsEnum(Category, { each: true, message: 'Category is not valid' })
  category: Category;

  @IsNotEmpty()
  @IsNumber()
  serves: number;
}
