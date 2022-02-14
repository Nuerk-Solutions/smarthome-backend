import { IntersectionType } from '@nestjs/mapped-types';
import { CreateAuthenticationDto } from './create-authentication.dto';
import { CreateUserDto } from '../../../users/dtos/create-user.dto';

export class RegistrationDto extends IntersectionType(CreateAuthenticationDto, CreateUserDto) {}
