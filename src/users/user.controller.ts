import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Authorization } from '../authentication/core/decorators/authorization.decorator';
import { RoleType } from '../authentication/core/enums/role-type.enum';
import { RequestWithUser } from '../authentication/core/interfaces/request-with-user.interface';
import { users as User } from '@prisma/client';

@Controller('user')
export class UserController {
  @Authorization(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUser(@Req() { user }: RequestWithUser): Promise<User> {
    return user;
  }
}
