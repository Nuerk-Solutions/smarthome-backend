import { BadRequestException } from '@nestjs/common';

export class NoRecipeFoundException extends BadRequestException {
  constructor(error?: string) {
    super('No recipe found for this account.', error);
  }
}
