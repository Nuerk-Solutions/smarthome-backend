import * as validator from 'class-validator';

import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform, Type } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ParseArray implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  private readonly type: Type<unknown>;

  private readonly separator: string;

  private readonly emptyHandling: { allow: boolean; allCases: boolean } = {
    allow: false,
    allCases: false,
  };

  constructor(options: {
    exceptionFactory?: (error: string) => any;
    errorHttpStatusCode?: HttpStatus;
    type: any;
    items: any;
    separator: string;
    emptyHandling?: { allow: boolean; allCases: boolean };
  }) {
    this.type = options.type;
    this.separator = options.separator;
    this.emptyHandling.allow = options.emptyHandling == undefined ? false : options.emptyHandling.allow;
    this.emptyHandling.allCases = options.emptyHandling == undefined ? false : options.emptyHandling.allCases;

    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options;
    this.exceptionFactory = exceptionFactory || ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  parseAndValidate(value: any) {
    if (!validator.isEnum(value, this.type)) {
      throw this.exceptionFactory(`${value} is not a valid value.`);
    }
    return value;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    let items: any;
    try {
      items = value.split(this.separator);
    } catch (error) {
      if (!this.emptyHandling.allow) throw this.exceptionFactory(`${metadata.data} is not parsable.`);
      if (this.emptyHandling.allCases) items = Object.values(this.type);
      else return '';
    }

    return items.map((item) => {
      return this.parseAndValidate(item);
    });
  }
}
