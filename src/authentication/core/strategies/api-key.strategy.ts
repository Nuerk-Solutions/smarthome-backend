import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../authentication.service';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super(
      {
        header: 'authorization',
        prefix: 'Api-Key ',
      },
      false,
      async (apiKey: string, done: (error: Error | null, data?: boolean) => void) => {
        if (this._authenticationService.validateApiKey(apiKey)) {
          return done(null, true);
        }
        return done(new UnauthorizedException(), null);
      },
    )
  }
}
