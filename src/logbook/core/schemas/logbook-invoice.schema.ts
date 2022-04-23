import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectID } from 'bson';

export type LogbookInvoiceDocument = LogbookInvoice & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: true })
export class LogbookInvoice {

  @Prop({ required: true })
  date: Date;
}

export const LogbookInvoiceSchema = SchemaFactory.createForClass(LogbookInvoice);
