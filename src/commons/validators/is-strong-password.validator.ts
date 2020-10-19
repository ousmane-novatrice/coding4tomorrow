import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  import { passwordRegex } from '~/commons/regexes/password.regex';
import { passwordConstraint } from '~/commons/validators/constraints/constraints-message';
  
  export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
      const message = `Property ${propertyName} ${passwordConstraint}`;
      registerDecorator({
        name: 'isStrongPassword',
        target: object.constructor,
        propertyName,
        constraints: [],
        options: { ...validationOptions, ...{ message } },
        validator: {
          validate(value: any, args: ValidationArguments) {
            return new RegExp(passwordRegex).test(value);
          },
        },
      });
    };
  }
  