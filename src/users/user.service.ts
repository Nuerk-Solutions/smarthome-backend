import { Injectable } from '@nestjs/common';
import { authentications as Authentication, users as User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly _prismaService: PrismaService) {}

  // /**
  //  * @deprecated Use {@link _createAuthentication}. instead. Because of the relations between the two models, this method results nothing.
  //  * @param createUserDto - The user to create.
  //  * @param authentication - The authentication to create.
  //  */
  // public async createUser(createUserDto: CreateUserDto, authentication?: Prisma.authenticationsCreateInput): Promise<User> {
  //   return this._prismaService.users.create({
  //     data: {
  //       ...createUserDto,
  //       ...authentication,
  //     },
  //   });
  // }

  public async getUser(uuid: string): Promise<User & { authentication: Authentication }> /* : Promise<User | undefined> */ {
    // Need prismaService as a parameter because the user.service ctr is not called at this point

    const test = await this._prismaService.authentications.findMany({});
    console.log(await test);

    return await this._prismaService.users.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        authentication: true,
      },
    });
  }
}
