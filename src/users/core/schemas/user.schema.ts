import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { ObjectId } from 'bson';
import { Authentication, AuthenticationSchema } from '../../../authentication/core/schemas/authentication.schema';

export type UserDocument = User & Document;

// Todo: Move Schemas, Optimize middleware in modules, fix callstack exceptions

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class User {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectId() })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    default: () => uuidv4(),
  })
  uuid: string;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({ type: AuthenticationSchema, required: true })
  authentication: Authentication;
}

export const UserSchema = SchemaFactory.createForClass(User);
