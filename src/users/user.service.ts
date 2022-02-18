import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './core/dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './core/schemas/user.schema';
import { CreateAuthenticationDto } from '../authentication/core/dto/create-authentication.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  /**
   * @param createUserDto - The user to create.
   * @param authentication - The authentication to create.
   */
  public async createUser(createUserDto: CreateUserDto, authentication?: CreateAuthenticationDto): Promise<User> {
    return await this._userModel.create({
      ...createUserDto,
      authentication: {
        ...authentication,
      },
    });
  }

  public async getUser(uuid: string): Promise<User> /* : Promise<User | undefined> */ {
    return await this._userModel.findOne({ uuid: uuid }).exec();
  }
}
