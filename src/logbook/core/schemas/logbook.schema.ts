import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Driver } from '../enums/driver.enum';
import { VehicleTyp } from '../enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../enums/additional-information-typ.enum';
import { ObjectId } from 'bson';

export type LogbookDocument = Logbook & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true }, _id: true })
export class Logbook {
  @Prop({ type: Types.ObjectId, required: true, default: () => new ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true, enum: Driver })
  driver: Driver;

  @Prop({ type: String, required: true, enum: VehicleTyp })
  vehicleTyp: VehicleTyp;

  @Prop({ required: true })
  currentMileAge: string;

  @Prop({ required: true })
  newMileAge: string;

  @Prop()
  forFree: boolean;

  @Prop()
  distance: string;

  @Prop()
  distanceCost: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: String, required: true, trim: true })
  driveReason: string;

  @Prop({ type: String, required: true, enum: AdditionalInformationTyp })
  additionalInformationTyp: AdditionalInformationTyp;

  @Prop()
  additionalInformation: string;

  @Prop()
  additionalInformationCost: string;

  @Prop()
  distanceSinceLastAdditionalInformation: string;
}

export const LogbookSchema = SchemaFactory.createForClass(Logbook);
