import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Role } from '../enums/role.enum';

export type AuthenticationDocument = Authentication & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Authentication {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    default: () => uuidv4(),
  })
  uuid: string;

  @Prop({
    type: String,
    required: false,
    enum: Role,
    default: () => Role.USER,
  })
  roles: Role[];

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  emailAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Boolean,
    required: false,
    default: () => false,
  })
  isEmailConfirmed: boolean;

  @Prop({
    type: String,
    required: false,
  })
  currentHashedRefreshToken: string;
}

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication);
