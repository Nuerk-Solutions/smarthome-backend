import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { RequestWithUserPayload } from '../authentication/core/interfaces/request-with-user-payload.interface';
import { User } from './core/schemas/user.schema';
import { Role } from '../authentication/core/enums/role.enum';

@Controller('user')
export class UserController {
  @Authorization(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUser(@Req() { user }: RequestWithUserPayload): Promise<User> {
    return user;
  }
}
