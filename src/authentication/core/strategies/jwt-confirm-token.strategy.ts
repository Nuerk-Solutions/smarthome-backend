import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../../authentication.service';
import { VerificationTokenPayload } from '../interfaces/verification-token-payload.interface';
import { WrongCredentialsProvidedException } from '../exceptions/wrong-credentials-provided.exception';
import { User } from '../../../users/core/schemas/user.schema';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(Strategy, 'jwt-confirm-token') {
  constructor(private readonly _configService: ConfigService, private readonly _authenticationService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ emailAddress }: VerificationTokenPayload): Promise<User> {
    const user = await this._authenticationService.getUserByEmail(emailAddress);

    if (!user) {
      throw new WrongCredentialsProvidedException();
    }

    if (user.authentication.isEmailConfirmed) {
      throw new BadRequestException('Email address is already confirmed');
    }

    return user;
  }
}
