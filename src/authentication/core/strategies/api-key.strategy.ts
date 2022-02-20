import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthenticationService } from '../../authentication.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super({ header: 'Authorization', prefix: 'Api-Key ' }, true, async (apiKey, done) => done(null, await this.validate(apiKey)));
  }

  async validate(apiKey: string): Promise<boolean> {
    return await this._authenticationService.validateApiKey(apiKey);
  }
}
