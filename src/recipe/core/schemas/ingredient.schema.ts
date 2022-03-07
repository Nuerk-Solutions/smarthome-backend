import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { MeasureUnit } from '../enums/measure-unit.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Ingredient {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: Types.ObjectId;

  // Example: 2x 400g chopped tomatoes

  @Prop({
    type: Number,
    required: false,
  })
  amount: number;

  @Prop({
    type: Number,
    required: false,
  })
  measure: number;

  @Prop({
    type: String,
    required: false,
    enum: MeasureUnit,
  })
  measureUnit: MeasureUnit;

  @Prop({
    type: String,
    required: true,
  })
  name: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
