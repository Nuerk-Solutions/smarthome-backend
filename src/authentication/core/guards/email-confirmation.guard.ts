import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    this.prismaService.authentications
      .findUnique({
        where: {
          id: request.user.authentication.id,
        },
      })
      .then((authentication) => {
        if (!authentication.isEmailConfirmed) {
          throw new UnauthorizedException('Confirm your email first');
        }
      })
      .catch((error) => {
        throw error;
      });
    return true;
  }
}
