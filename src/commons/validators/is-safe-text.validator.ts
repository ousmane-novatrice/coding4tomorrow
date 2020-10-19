import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { map, camelCase } from 'lodash';

export function IsSafeText(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    const unsafeChars = '[]{}()<>"';
    const message = `Property ${propertyName} must not contain unsafe characters: ${unsafeChars}!`;

    registerDecorator({
      name: camelCase(IsSafeText.name),
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, ...{ message } },
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const escapedUnsafeChars = map(
            unsafeChars,
            (char: string) => '\\' + char,
          ).join('');
          const escapedUnsafeCharSet = ''.concat('[', escapedUnsafeChars, ']');
          const containsUnsafeChars = new RegExp(
            escapedUnsafeCharSet,
            'ig',
          ).test(value);
          return !containsUnsafeChars;
        },
      },
    });
  };
}
