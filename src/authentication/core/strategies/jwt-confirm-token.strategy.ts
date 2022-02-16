import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../../authentication.service';
import { VerificationTokenPayload } from '../interfaces/verification-token-payload.interface';
import { Authentication, User } from '@prisma/client';
import { WrongCredentialsProvidedException } from '../exceptions/wrong-credentials-provided.exception';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(Strategy, 'jwt-confirm-token') {
  constructor(private readonly _configService: ConfigService, private readonly _authenticationService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ emailAddress }: VerificationTokenPayload): Promise<User & { authentication: Authentication }> {
    const authentication = await this._authenticationService.getAuthentication(emailAddress);

    if (!authentication) {
      throw new WrongCredentialsProvidedException();
    }

    if (authentication.isEmailConfirmed) {
      throw new BadRequestException('Email address is already confirmed');
    }

    return { ...authentication.user, authentication };
  }
}
