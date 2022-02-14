import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../enums/role-type.enum';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prismaService: PrismaService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>('roles', [context.getHandler(), context.getClass]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return this.prismaService.authentications
      .findUnique({
        where: {
          id: user.authenticationId,
        },
      })
      .then((authentication) => {
        return requiredRoles.some((role) => {
          authentication.role.includes(role);
        });
      })
      .catch((error) => {
        throw error;
      });
  }
}
