import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { validateHash } from '../core/utils/hash.util';
import { RefreshTokenNoMatchingException } from './core/exceptions/refresh-token-no-matching.exception';
import { WrongCredentialsProvidedException } from './core/exceptions/wrong-credentials-provided.exception';
import { RegistrationDto } from './core/dto/registration.dto';
import { TokenPayload } from './core/interfaces/token-payload.interface';
import { VerificationTokenPayload } from './core/interfaces/verification-token-payload.interface';
import { MailService } from '../core/mail/mail.service';
import { User } from '../users/core/schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _userService: UserService,
    @Inject(forwardRef(() => MailService))
    private readonly _mailService: MailService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * @param encodedRefreshToken The encoded refresh token
   * @param user The user to check the refresh token against
   * @returns The user if the refresh token is valid
   */
  public async getUserIfRefreshTokenMatches(encodedRefreshToken: string, user: User) {
    const isRefreshTokenMatching = await validateHash(encodedRefreshToken, user.authentication.currentHashedRefreshToken);

    if (!isRefreshTokenMatching) {
      throw new RefreshTokenNoMatchingException();
    }
    return user;
  }

  public async getAuthenticatedUser(emailAddress: string, plainTextPassword: string): Promise<User> {
    const user = await this._userService.getUserByEmail(emailAddress);

    if (!user) {
      // The same Exception is given to prevent the controller from API attacks
      throw new WrongCredentialsProvidedException();
    }

    const isPasswordMatching = await validateHash(plainTextPassword, user.authentication.password);

    if (!isPasswordMatching) {
      throw new WrongCredentialsProvidedException();
    }
    return user;
  }

  public async registration({ firstName, ...rest }: RegistrationDto): Promise<User> {
    try {
      // const authentication = new Authentication();
      const user = await this._userService.createUser({ firstName }, { ...rest });
      return user;
    } catch (error) {
      if (error.name === 'MongoServerError') {
        // Unique violation error code for Postgres
        if (error.code === 11000) {
          throw new BadRequestException('User with that email already exists');
        }
        throw new InternalServerErrorException();
      }
    }
  }

  public async login(user: User): Promise<string[]> {
    const accessTokenCookie = this._getCookieWithJwtAccessToken(user.uuid);
    const { cookie: refreshTokenCookie, token: refreshToken } = this._getCookieWithJwtRefreshToken(user.uuid);

    await this._setCurrentRefreshToken(user.authentication._id, refreshToken);

    return [accessTokenCookie, refreshTokenCookie];
  }

  async logout(user: User): Promise<void> {
    await this._removeRefreshToken(user.authentication._id);
  }

  public getCookiesForLogout(): string[] {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  public refreshToken(user: User): string {
    return this._getCookieWithJwtAccessToken(user.uuid);
  }

  public async confirm(user: User) {
    return this._markEmailAsConfirmed(user.authentication.emailAddress);
  }

  public async resendConfirmationLink(user: User): Promise<void> {
    if (user.authentication.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }
    await this._mailService.sendConfirmationEmail(user);
  }

  public getJwtConfirmToken(emailAddress: string): string {
    const payload: VerificationTokenPayload = { emailAddress };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this._configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });
    return token;
  }

  public async validateApiKey(apiKey: string): Promise<boolean> {
    const apiKeys: string[] = ['ca03na188ame03u1d78620de67282882a84', 'd2e621a6646a4211768cd68e26f21228a81'];

    return apiKeys.includes(apiKey);
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

  private async _setCurrentRefreshToken(authenticationId: mongoose.Types.ObjectId, currentHashedRefreshToken: string) {
    return await this._userService.updateUserByAuthenticationId(authenticationId, {
      'authentication.currentHashedRefreshToken': currentHashedRefreshToken,
    });
    // this._userModel.updateOne(
    //   { 'authentication._id': authenticationId },
    //   {
    //     $set: {
    //       'authentication.currentHashedRefreshToken': currentHashedRefreshToken,
    //     },
    //   },
    // );
  }

  private async _removeRefreshToken(authenticationId: mongoose.Types.ObjectId) {
    return await this._userService.updateUserByAuthenticationId(authenticationId, {
      'authentication.currentHashedRefreshToken': null,
    });
    // return this._userModel.updateOne(
    //   { 'authentication._id': authenticationId },
    //   {
    //     $set: { 'authentication.currentHashedRefreshToken': null },
    //   },
    // );
  }

  private async _markEmailAsConfirmed(emailAddress: string) {
    return await this._userService.updateUserByEmailAddress(emailAddress, {
      'authentication.isEmailConfirmed': true,
    });
    // return this._userModel.updateOne(
    //   { 'authentication.emailAddress': emailAddress },
    //   {
    //     $set: { 'authentication.isEmailConfirmed': true },
    //   },
    // );
  }
}
