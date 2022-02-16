import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Authentication, Prisma, User } from '@prisma/client';
import { validateHash } from '../utils/hash.util';
import { RefreshTokenNoMatchingException } from './core/exceptions/refresh-token-no-matching.exception';
import { WrongCredentialsProvidedException } from './core/exceptions/wrong-credentials-provided.exception';
import { RegistrationDto } from './core/dto/registration.dto';
import { TokenPayload } from './core/interfaces/token-payload.interface';
import { CreateAuthenticationDto } from './core/dto/create-authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly _userService: UserService, private readonly _jwtService: JwtService, private readonly _configService: ConfigService, private readonly _prismaService: PrismaService) {}

  /**
   * Authenticates a user by email by searching for it in the authentication database
   * @param emailAddress
   */
  public async getAuthentication(emailAddress: string): Promise<Authentication & { user: User }> /* : Promise<Authentication> */ {
    return this._prismaService.authentication.findFirst({
      where: {
        emailAddress: emailAddress,
      },
      include: {
        user: true,
      },
    });
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

  public async registration({ firstName, ...rest }: RegistrationDto): Promise<User> {
    try {
      const authentication = await this._createAuthentication(rest);
      const user = await this._userService.createUser({ firstName }, authentication);
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique violation error code for Postgres
        if (error?.code === 'P2002') {
          throw new BadRequestException('User with that email already exists');
        }
        throw new InternalServerErrorException();
      }
    }
  }

  public async login(user: User & { authentication: Authentication }): Promise<string[]> {
    const accessTokenCookie = this._getCookieWithJwtAccessToken(user.uuid);
    const { cookie: refreshTokenCookie, token: refreshToken } = this._getCookieWithJwtRefreshToken(user.uuid);

    await this._setCurrentRefreshToken(user.authenticationId, refreshToken);

    return [accessTokenCookie, refreshTokenCookie];
  }

  async logout(user: User & { authentication: Authentication }): Promise<void> {
    await this._removeRefreshToken(user.authentication.id);
  }

  public getCookiesForLogout(): string[] {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  public refreshToken(user: User & { authentication: Authentication }): string {
    return this._getCookieWithJwtAccessToken(user.uuid);
  }

  public async confirm(authentication: Authentication) {
    return this._markEmailAsConfirmed(authentication.emailAddress);
  }

  public async resendConfirmationLink(authentication: Authentication): Promise<void> {
    if (authentication.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }
    // Todo: Send email with confirmation link
  }

  private async _createAuthentication(createAuthenticationDto: CreateAuthenticationDto): Promise<Authentication> {
    return this._prismaService.authentication.create({
      data: {
        roles: ['USER'],
        ...createAuthenticationDto,
      },
    });
  }

  /**
   * Creates a JWT access token
   * @param uuid The user's UUID
   * @returns The JWT access token
   */
  private _getCookieWithJwtRefreshToken(uuid: string) {
    const payload: TokenPayload = { uuid };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this._configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return { cookie, token };
  }

  private _getCookieWithJwtAccessToken(uuid: string) {
    const payload: TokenPayload = { uuid };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this._configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  private async _setCurrentRefreshToken(authenticationId: number, currentHashedRefreshToken: string) {
    return this._prismaService.authentication.update({
      where: {
        id: authenticationId,
      },
      data: {
        currentHashedRefreshToken,
      },
    });
  }

  private async _removeRefreshToken(authenticationId: number) {
    return this._prismaService.authentication.update({
      where: {
        id: authenticationId,
      },
      data: {
        currentHashedRefreshToken: null,
      },
    });
  }

  private async _markEmailAsConfirmed(emailAddress: string) {
    return this._prismaService.authentication.update({
      where: {
        emailAddress,
      },
      data: {
        isEmailConfirmed: true,
      },
    });
  }
}