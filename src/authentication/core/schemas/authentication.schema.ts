import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectId } from 'bson';
import { Role } from '../enums/role.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Authentication {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectId() })
  _id: Types.ObjectId;

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
