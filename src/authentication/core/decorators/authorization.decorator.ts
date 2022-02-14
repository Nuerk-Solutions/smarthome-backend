import { RoleType } from '../enums/role-type.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EmailConfirmationGuard } from '../guards/email-confirmation.guard';
import { JwtAccessTokenGuard } from '../guards/jwt-access-token.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authorization(...roles: RoleType[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAccessTokenGuard, RolesGuard, EmailConfirmationGuard));
}
