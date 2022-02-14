import { BadRequestException } from '@nestjs/common';

export class RefreshTokenNoMatchingException extends BadRequestException {
  constructor(error?: string) {
    super('Refresh token does not match any existing refresh token', error);
  }
}
