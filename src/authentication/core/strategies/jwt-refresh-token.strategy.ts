import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../../users/user.service';
import { AuthenticationService } from '../../authentication.service';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { encodeString } from '../../../core/utils/hash.util';
import { WrongCredentialsProvidedException } from '../exceptions/wrong-credentials-provided.exception';
import { User } from '../../../users/core/schemas/user.schema';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly _authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: _configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  public async validate(request: Request, { uuid }: TokenPayload): Promise<User> {
    const refreshToken = request.cookies.Refresh;
    const encodedRefreshToken = encodeString(refreshToken);
    const user = await this._userService.getUserByUuid(uuid);

    if (!user) {
      // The same Exception is given to prevent the controller from API attacks
      throw new WrongCredentialsProvidedException();
    }

    return await this._authenticationService.getUserIfRefreshTokenMatches(encodedRefreshToken, user);
  }
}
