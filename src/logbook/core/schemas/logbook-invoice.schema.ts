import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogbookInvoiceDocument = LogbookInvoice & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: true })
export class LogbookInvoice {
  @Prop({ required: true })
  date: Date;
}

export const LogbookInvoiceSchema = SchemaFactory.createForClass(LogbookInvoice);
