import { ValidationOptions, registerDecorator } from 'class-validator';
import { emailRegex } from '~/commons/regexes/email.regex';

export function IsEmail(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    const message = `Property ${propertyName} is invalid`;
    registerDecorator({
      name: 'isEmail',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, ...{ message } },
      validator: {
        validate(value: string) {
          return emailRegex.test(String(value).toLowerCase());
        },
      },
    });
  };
}
