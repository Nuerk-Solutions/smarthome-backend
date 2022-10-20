import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ParseSortString implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  constructor(options: { exceptionFactory?: (error: string) => any; errorHttpStatusCode?: HttpStatus } = {}) {
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options;
    this.exceptionFactory = exceptionFactory || ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (value == undefined) return undefined;
    const match = new RegExp('(?<!\\()-|\\+').test(value);
    if (!match)
      throw this.exceptionFactory(
        `Given input is not parsable. Please use the following format: "+${value}" or "-${value}"`,
      );
    return value;
  }
}
