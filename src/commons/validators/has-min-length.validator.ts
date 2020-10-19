import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function hasMinLength(
  exactLength: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    const message = `Property ${propertyName} must hold a value with length greater or equal to ${exactLength}`;
    registerDecorator({
      name: 'hasMinLength',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { ...validationOptions, ...{ message } },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value && value.toString().trim().length >= exactLength;
        },
      },
    });
  };
}
