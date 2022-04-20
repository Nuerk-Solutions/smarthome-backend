import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyAuthenticationGuard extends AuthGuard('api-key') {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (request && request.query['api-key'] && !request.header('Authorization')) {
      request.headers['Authorization'] = `Api-Key ${request.query['api-key']}`;
      request.headers.Authorization = `Api-Key ${request.query['api-key']}`
      return true;
    }
    return super.canActivate(context);
  }
}
