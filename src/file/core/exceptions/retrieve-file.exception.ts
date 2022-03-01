import { BadRequestException } from '@nestjs/common';

export class RetrieveFileException extends BadRequestException {
  constructor(error?: string) {
    super('An error occurred while retrieving data about file', error);
  }
}
