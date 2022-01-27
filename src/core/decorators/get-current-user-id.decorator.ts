import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../auth/types/jwt-payload.type';

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as JwtPayload;

  if (!user) throw new UnauthorizedException('Invalid Token Data');

  return user.sub;
});
