import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../authentication.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super({ header: 'Authorization', prefix: 'Api-Key ' }, true, async (apiKey, done, request) => {
      console.log(request.headers);
      return this.validate(apiKey, done);
    });
  }

  validate(apiKey: string, done: (error: Error, data) => {}) {
    if (this._authenticationService.validateApiKey(apiKey)) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  }
}
