import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';
import { TimeUnit } from '../enums/time-unit.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Time {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    required: true
  })
  duration: number;

  @Prop({
    type: String,
    required: true,
    enum: TimeUnit
  })
  timeUnit: TimeUnit;
}
