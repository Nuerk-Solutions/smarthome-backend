/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { authentications as Authentication, users as User } from '@prisma/client';
import { validateHash } from '../utils/hash.util';
import { RefreshTokenNoMatchingException } from './core/exceptions/refresh-token-no-matching.exception';
import { WrongCredentialsProvidedException } from './core/exceptions/wrong-credentials-provided.exception';

@Injectable()
export class AuthenticationService {
  constructor(private readonly _userService: UserService, private readonly _jwtService: JwtService, private readonly _configService: ConfigService, private readonly _prismaService: PrismaService) {}

  // Todo: Check if it returns actually the user
  /**
   * Authenticates a user by email by searching for it in the authentication database
   * @param emailAddress
   */
  public async getAuthentication(emailAddress: string) /* : Promise<Authentication> */ {
    return this._prismaService.authentications.findFirst({
      where: {
        emailAddress: emailAddress,
      },
      include: {
        user: true,
      },
    });
    // .user().authentication()
  }

  /**
   * @param encodedRefreshToken The encoded refresh token
   * @param user The user to check the refresh token against
   * @returns The user if the refresh token is valid
   */
  public async getUserIfRefreshTokenMatches(encodedRefreshToken: string, user: User & { authentication: Authentication }) {
    const isRefreshTokenMatching = await validateHash(encodedRefreshToken, user.authentication.currentHashedRefreshToken);

    if (!isRefreshTokenMatching) {
      throw new RefreshTokenNoMatchingException();
    }
    return user;
  }

  public async getAuthenticatedUser(emailAddress: string, plainTextPassword: string): Promise<User> {
    const authentication = await this.getAuthentication(emailAddress);

    if (!authentication) {
      // The same Exception is given to prevent the controller from API attacks
      throw new WrongCredentialsProvidedException();
    }

    const isPasswordMatching = await validateHash(plainTextPassword, authentication.password);

    if (!isPasswordMatching) {
      throw new WrongCredentialsProvidedException();
    }
    return authentication.user;
  }
}
