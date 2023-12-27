import {
    IsBoolean,
    IsDateString, IsDecimal,
    IsEnum,
    IsISO8601,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import {Driver} from '../enums/driver.enum';
import {Vehicle} from '../enums/vehicle-typ.enum';
import {IsNotBlank} from '../validation/decorators/IsNotBlank';
import {IsLowerThan} from '../validation/decorators/IsLowerThan';
import {IsGreaterThan} from '../validation/decorators/IsGreaterThan';
import {Unit} from "../enums/unit.enum";
import {Type} from "class-transformer";


class Refuel {
    @IsNotEmpty()
    @IsDecimal()
    readonly liters: number;

    @IsNotEmpty()
    @IsDecimal()
    readonly price: number;

    @IsOptional()
    @IsBoolean()
    readonly isSpecial: boolean = false;
}

class Service {
    @IsNotEmpty()
    @IsString()
    @IsNotBlank(null, {message: 'message must be a string containing at least one alphabetic character'})
    readonly message: string;

    @IsNotEmpty()
    @IsDecimal()
    readonly price: number;
}

class Details {
    @IsBoolean()
    readonly covered: boolean;

    @IsOptional()
    @IsEnum(Driver, {each: true, message: 'Driver is not valid'})
    readonly driver: Driver = Driver.CLAUDIA;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly code?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly notes?: string;
}

class MileAge {
    @IsNotEmpty()
    @IsNumberString()
    @IsLowerThan('new', {message: 'current must be lower than new mileage'})
    readonly current: number;

    @IsNotEmpty()
    @IsNumberString()
    @IsGreaterThan('current', {message: 'new must be greater than current mileage'})
    readonly new: number;

    @IsNotEmpty()
    @IsEnum(Unit, {message: 'Unit is not valid'})
    readonly unit: Unit;
}

export class CreateLogbookDto {

    @IsNotEmpty()
    @IsEnum(Driver, {each: true, message: 'Driver is not valid'})
    readonly driver: Driver;

    @IsNotEmpty()
    @IsEnum(Vehicle, {each: true, message: 'Vehicle is not valid'})
    readonly vehicle: Vehicle;

    @IsNotEmpty()
    @IsISO8601()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    @IsNotBlank(null, {message: 'driveReason must be a string containing at least one alphabetic character'})
    reason: string;

    @IsNotEmpty()
    @Type(() => MileAge)
    @ValidateNested()
    readonly mileAge: MileAge;

    @IsNotEmpty()
    @Type(() => Details)
    @ValidateNested()
    readonly details: Details;

    @IsOptional()
    @Type(() => Refuel)
    @ValidateNested()
    readonly refuel?: Refuel;

    @Type(() => Service)
    @ValidateNested()
    readonly service?: Service;
}
