import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EmailConfirmationGuard } from '../guards/email-confirmation.guard';
import { JwtAccessTokenGuard } from '../guards/jwt-access-token.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../enums/role.enum';

export function Authorization(...roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAccessTokenGuard, RolesGuard, EmailConfirmationGuard));
}
