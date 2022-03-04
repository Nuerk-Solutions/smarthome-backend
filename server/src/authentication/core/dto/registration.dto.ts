import { IntersectionType } from '@nestjs/mapped-types';
import { CreateAuthenticationDto } from './create-authentication.dto';
import { CreateUserDto } from '../../../users/core/dtos/create-user.dto';

export class RegistrationDto extends IntersectionType(CreateAuthenticationDto, CreateUserDto) {
}
