import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Category {
  @Prop({ type: Types.ObjectId, default: () => new ObjectID() })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  uuid: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
