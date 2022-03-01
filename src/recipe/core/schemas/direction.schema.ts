import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Direction {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  step: number;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;
}

export const DirectionSchema = SchemaFactory.createForClass(Direction);
