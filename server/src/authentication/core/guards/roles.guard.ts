import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUserPayload } from '../interfaces/request-with-user-payload.interface';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass]);

    if (!requiredRoles) {
      return true;
    }

    const request: RequestWithUserPayload = context.switchToHttp().getRequest();

    return requiredRoles.some((roles) => request.user.authentication.roles.includes(roles));
  }
}
