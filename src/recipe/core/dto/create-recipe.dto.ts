import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Time } from '../schemas/time.schema';
import { Ingredient } from '../schemas/ingredient.schema';
import { Direction } from '../schemas/direction.schema';
import { Category } from '../enums/category.enum';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsUrl()
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

  @IsISO8601()
  datePublished: Date;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  serves: number;
}
