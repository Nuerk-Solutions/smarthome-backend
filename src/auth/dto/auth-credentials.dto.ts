import {IsArray, IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {Role} from '../../core/enums/role.enum';

export class AuthCredentialsDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsArray()
    roles: Role[];

    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class AuthEmailDto {
    @IsString()
    @IsEmail()
    email: string;
}

export class UpdateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    name: string;
}
