import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyAuthenticationGuard } from '../guards/api-key.guard';

export function ApiKey() {
  return applyDecorators(UseGuards(ApiKeyAuthenticationGuard));
}
