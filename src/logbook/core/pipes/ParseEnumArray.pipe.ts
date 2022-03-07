import * as validator from 'class-validator';

import { HttpStatus, Injectable, PipeTransform, Type } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ParseArray implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  private readonly type: Type<unknown>;

  private readonly separator: string;

  constructor(options: any) {
    this.type = options.type;
    this.separator = options.separator;

    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options;
    this.exceptionFactory = exceptionFactory || ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  parseAndValidate(value: any) {
    if (!validator.isEnum(value, this.type)) {
      throw this.exceptionFactory(`${value} is not a valid value.`);
    }
    return value;
  }

  transform(value: any) {
    let items: any;
    try {
      items = value.split(this.separator);
    } catch (error) {
      throw this.exceptionFactory('Given input is not parsable.');
    }

    return items.map((item) => {
      return this.parseAndValidate(item);
    });
  }
}
