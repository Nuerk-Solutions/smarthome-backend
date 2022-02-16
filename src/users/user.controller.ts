import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { RequestWithUserPayload } from '../authentication/core/interfaces/request-with-user-payload.interface';
import { Role, User } from '@prisma/client';

@Controller('user')
export class UserController {
  @Authorization(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUser(@Req() { user }: RequestWithUserPayload): Promise<User> {
    return user;
  }
}
