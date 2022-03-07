import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../../authentication.service';
import { User } from '../../../users/core/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly _authenticationService: AuthenticationService) {
    super({
      usernameField: 'emailAddress',
      passwordField: 'password',
    });
  }

  public async validate(emailAddress: string, password: string): Promise<User> {
    return await this._authenticationService.getAuthenticatedUser(emailAddress, password);
  }
}
