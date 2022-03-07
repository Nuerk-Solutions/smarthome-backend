import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './core/dtos/create-user.dto';
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

  public async getUserByUuid(uuid: string): Promise<User> /* : Promise<User | undefined> */ {
    return await this._userModel.findOne({ uuid: uuid }).exec();
  }

  /**
   * Authenticates a user by email by searching for it in the authentication database
   * @param emailAddress
   */
  public async getUserByEmail(emailAddress: string): Promise<User> /* : Promise<Authentication> */ {
    // Return the user with the given email address from authentication
    return await this._userModel.findOne({ 'authentication.emailAddress': emailAddress.toLowerCase() }).exec();
  }

  public async updateUserByAuthenticationId(authenticationId: Types.ObjectId, value: object): Promise<User> {
    return await this._userModel
      .findOneAndUpdate(
        { 'authentication._id': authenticationId },
        {
          $set: value,
        },
        { new: true },
      )
      .exec();
  }

  public async updateUserByEmailAddress(emailAddress: string, value: object): Promise<User> {
    return await this._userModel
      .findOneAndUpdate(
        { 'authentication.emailAddress': emailAddress },
        {
          $set: value,
        },
        { new: true },
      )
      .exec();
  }
}
