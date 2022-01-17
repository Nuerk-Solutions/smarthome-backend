import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AdditionalInformationTyp,
  Driver,
  VehicleTyp,
} from '../dto/create-logbook.dto';

export type LogbookDocument = Logbook & Document;

@Schema()
export class Logbook {
  @Prop({ type: String, required: true, enum: Driver })
  driver: Driver;

  @Prop({ type: String, required: true, enum: VehicleTyp })
  vehicleTyp: VehicleTyp;

  @Prop({ required: true })
  currentMileAge: string;

  @Prop({ required: true })
  newMileAge: string;

  @Prop()
  distance: string;

  @Prop()
  distanceCost: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
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
