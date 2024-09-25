import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function Compare(validate: (obj) => boolean , opts: { message: string }): PropertyDecorator {
  return ({constructor}, property: string) => {
    registerDecorator({
      name: 'Compare',
      propertyName: property,
      target: constructor,
      options: opts,
      validator: { validate(v: any, {object}) { return validate(object) } }
    })
  }
}



export function CompareDates(property: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'CompareDates',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value && relatedValue && value > relatedValue; // Vérifie que la dateFin est plus grande que dateDebut
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} doit être plus petite que ${args.property}`;
        },
      },
    });
  };
}