import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Driver } from '../enums/driver.enum';
import { ObjectId } from 'bson';

export type VoucherDocument = Voucher & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, _id: true, versionKey: false })
export class Voucher {

  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: false })
  distance?: number;

  @Prop({ required: false })
  remainingDistance?: number;

  @Prop({ required: true })
  expiration: Date;

  @Prop({ default: false })
  isExpired?: boolean;

  @Prop({ required: true })
  creator: Driver;

  @Prop({ default: false })
  redeemed?: boolean;

}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
