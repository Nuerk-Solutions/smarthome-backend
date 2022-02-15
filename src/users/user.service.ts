import { Injectable } from '@nestjs/common';
import { authentications as Authentication, Prisma, users as User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly _prismaService: PrismaService) {}

  /**
   * @deprecated Use {@link _createAuthentication}. instead. Because of the relations between the two models, this method results nothing.
   * @param createUserDto - The user to create.
   * @param authentication - The authentication to create.
   */
  public async createUser(createUserDto: CreateUserDto, authentication?: Prisma.authenticationsCreateInput): Promise<User> {
    return this._prismaService.users.create({
      data: {
        ...createUserDto,
        ...authentication,
      },
    });
  }

  public async getUser(uuid: string): Promise<User & { authentication: Authentication }> /* : Promise<User | undefined> */ {
    return this._prismaService.users.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        authentication: true,
      },
    });
  }
}
