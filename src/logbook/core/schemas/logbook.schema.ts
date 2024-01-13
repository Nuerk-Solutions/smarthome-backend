import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, mongo, Types} from 'mongoose';
import {Driver} from '../enums/driver.enum';
import {Vehicle} from '../enums/vehicle-typ.enum';
import {Int32, ObjectId} from 'bson';
import * as mongoose from "mongoose";
import {Unit} from "../enums/unit.enum";

export type LogbookDocument = NewLogbook & Document;

@Schema({_id: false})
export class MileAge {
    @Prop({type: Int32, required: true})
    current: number;

    @Prop({type: Int32, required: true})
    new: number;

    @Prop({type: String, enum: Unit, required: true})
    unit: string;

    @Prop({type: Int32, required: true, min: 1})
    difference: number;

    @Prop({type: mongoose.Types.Decimal128, required: true})
    cost: number;
}

export const MileAgeSchema = SchemaFactory.createForClass(MileAge);

@Schema({_id: false})
export class Refuel {
    @Prop({type: mongoose.Types.Decimal128, required: true})
    liters: number;

    @Prop({type: mongoose.Types.Decimal128, required: true})
    price: number;

    @Prop({type: Int32, required: true})
    distanceDifference: number;

    @Prop({type: mongoose.Types.Decimal128, required: true})
    consumption: number;

    @Prop({type: Boolean, required: true, default: false})
    isSpecial: boolean;

    @Prop({type: Types.ObjectId, required: false})
    previousRecordId?: ObjectId;
}

export const RefuelSchema = SchemaFactory.createForClass(Refuel);

@Schema({_id: false, strict: true})
export class Service {
    @Prop({type: String, required: true})
    message: string;

    @Prop({type: mongoose.Types.Decimal128, required: true})
    price: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

@Schema({_id: false, strict: true})
export class Details {
    @Prop({type: Boolean, required: true, default: false})
    covered: boolean;

    @Prop({type: String, enum: Driver, required: false})
    driver?: Driver;

    @Prop({type: String, required: false})
    code?: string;

    @Prop({type: String, required: false})
    notes?: string;
}

export const DetailsSchema = SchemaFactory.createForClass(Details);

@Schema({timestamps: {createdAt: true, updatedAt: false}, _id: true, versionKey: false, strict: true})
export class NewLogbook {
    @Prop({type: Types.ObjectId, required: true, default: () => new ObjectId()})
    _id?: Types.ObjectId;

    @Prop({type: String, required: true, enum: Driver})
    driver: Driver;

    @Prop({type: String, required: true, enum: Vehicle})
    vehicle: Vehicle;

    @Prop({type: Date, required: true})
    date: Date;

    @Prop({type: String, required: true, trim: true, minlength: 1})
    reason: string;

    @Prop({type: MileAgeSchema, required: true})
    mileAge: MileAge;

    @Prop({type: DetailsSchema, required: true})
    details: Details;

    @Prop({type: RefuelSchema, required: false})
    refuel?: Refuel;

    @Prop({type: ServiceSchema, required: false})
    service?: Service
}

export const LogbookSchema = SchemaFactory.createForClass(NewLogbook);
