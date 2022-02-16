import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { RequestWithUser } from '../authentication/core/interfaces/request-with-user.interface';
import { Role, User } from '@prisma/client';

@Controller('user')
export class UserController {
  @Authorization(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUser(@Req() { user }: RequestWithUser): Promise<User> {
    return user;
  }
}
