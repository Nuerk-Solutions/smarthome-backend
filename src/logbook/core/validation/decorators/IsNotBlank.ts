import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { AdditionalInformationTyp } from '../../enums/additional-information-typ.enum';

export function IsNotBlank(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotBlank',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (args != null && property != null) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            if (
              relatedValue != null &&
              typeof relatedValue === 'string' &&
              relatedValue != AdditionalInformationTyp.KEINE
            ) {
              return typeof value === 'string' && value.trim().length > 0 && relatedValue.trim().length > 0;
            } else {
              return true;
            }
          }
          return typeof value === 'string' && value.trim().length > 0;
        },
      },
    });
  };
}
