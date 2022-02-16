import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../../users/user.service';
import { AuthenticationService } from '../../authentication.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { User } from '@prisma/client';
import { encodeString } from '../../../utils/hash.util';
import { WrongCredentialsProvidedException } from '../exceptions/wrong-credentials-provided.exception';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly _configService: ConfigService, private readonly _userService: UserService, private readonly _authenticationService: AuthenticationService) {
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

  async validate(request: Request, { uuid }: TokenPayload): Promise<User> {
    const refreshToken = request.cookies.Refresh;
    const encodedRefreshToken = encodeString(refreshToken);
    const user = await this._userService.getUser(uuid);

    if (!user) {
      // The same Exception is given to prevent the controller from API attacks
      throw new WrongCredentialsProvidedException();
    }

    return this._authenticationService.getUserIfRefreshTokenMatches(encodedRefreshToken, user);
  }
}
