import {BadRequestException, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {Role} from '../enums/role.enum';
import {ROLES_KEY} from '../decorators/role.decorator';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthTokenGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Check if @isPublic guard is decorated
        const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

        if (isPublic) return true;

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler()]);
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        if (!request.headers?.authorization) {
            throw new BadRequestException('Authorization does not provided.');
        }
        const user: any = JwtService.prototype.decode(request.headers.authorization.split(' ')[1], {
            complete: true,
        });
        if (!user) throw new UnauthorizedException();

        return requiredRoles.some((role) => user.payload.roles?.includes(role));

        // Default fallback
        //return super.canActivate(context);
    }
}
