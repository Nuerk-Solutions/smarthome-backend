import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';

export type LocationDocument = Location & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Location {
  @Prop({ type: Types.ObjectId, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  uuid: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
