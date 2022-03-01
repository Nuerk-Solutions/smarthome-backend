import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { Category } from '../enums/category.enum';
import { Direction } from './direction.schema';
import { Time } from './time.schema';
import { Ingredient } from './ingredient.schema';

export type RecipeDocument = Recipe & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: true })
export class Recipe {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  image: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Time,
    required: true,
  })
  preparationTime: Time;

  @Prop({
    type: Time,
    required: true,
  })
  cookingTime: Time;

  @Prop({
    type: Array,
    required: true,
  })
  ingredients: Ingredient[];

  @Prop({
    type: Array,
    required: true,
  })
  directions: Direction[];

  @Prop({
    type: String,
    required: true,
    enum: Category,
  })
  category: string;

  @Prop({
    type: Date,
    required: true,
  })
  datePublished: Date;

  @Prop({
    type: String,
    required: true,
  })
  author: string;

  @Prop({
    type: Number,
  })
  serves: number;

  // TODO: Add nutrition info
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
