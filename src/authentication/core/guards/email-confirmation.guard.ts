import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { Observable } from 'rxjs';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.authentication?.isEmailConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }
    return true;
  }
}
