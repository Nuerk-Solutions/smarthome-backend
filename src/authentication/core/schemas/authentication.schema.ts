import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

export type AuthenticationDocument = Authentication & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: false })
export class Authentication {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

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
