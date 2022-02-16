import { Injectable } from '@nestjs/common';
import { Authentication, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly _prismaService: PrismaService) {}

  /**
   * @param createUserDto - The user to create.
   * @param authentication - The authentication to create.
   */
  public async createUser(createUserDto: CreateUserDto, authentication?: Authentication): Promise<User> {
    return this._prismaService.user.create({
      data: {
        ...createUserDto,
        authentication: {
          connect: {
            id: authentication.id,
          },
        },
      },
    });
  }

  public async getUser(uuid: string): Promise<User & { authentication: Authentication }> /* : Promise<User | undefined> */ {
    return await this._prismaService.user.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        authentication: true,
      },
    });
  }
}
