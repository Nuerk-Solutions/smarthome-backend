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
      true,
      async (apiKey, done) => this.validate(apiKey, done),
    );
  }

  validate(apiKey: string, done: (error: Error, data) => {}) {
    if (this._authenticationService.validateApiKey(apiKey)) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  }
}
