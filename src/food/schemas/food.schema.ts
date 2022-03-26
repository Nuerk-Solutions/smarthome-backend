import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { MeasureUnit } from '../../recipe/core/enums/measure-unit.enum';

export type FoodDocument = Food & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Food {
  @Prop({ type: Types.ObjectId, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;

  @Prop({
    type: String,
    required: true,
    enum: MeasureUnit,
  })
  measureUnit: MeasureUnit;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  // TODO: Outsource to a separate schema
  @Prop({
    type: String,
    required: true,
  })
  category: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiryDate: Date;

  @Prop({
    type: Date,
    required: true,
  })
  creationDate: Date;

  @Prop({
    type: Number,
    required: true,
  })
  barcode: Number;

  @Prop({
    type: Number,
    required: false,
  })
  minimum: Number;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
