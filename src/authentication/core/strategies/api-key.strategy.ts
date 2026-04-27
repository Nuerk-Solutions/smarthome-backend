import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../authentication.service';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super(
      {
        header: 'authorization',
        prefix: 'Api-Key ',
      },
      false,
    );
  }

  validate(apiKey: string) {
    console.log(apiKey)
    const validate = this.authenticationService.validateApiKey(apiKey);
    console.log(validate)
    if (!validate) {
      throw new UnauthorizedException();
    }

    return true;
  }
}