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
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          console.log('Comparaison:', {
            [propertyName]: value,
            [relatedPropertyName]: relatedValue,
          });

          // Vérifie que les deux valeurs sont définies
          if (!value || !relatedValue) return false;

          // Convertir les heures au format Date sans décalage horaire
          const valueDate = new Date(`1970-01-01T${value}:00`);
          const relatedDate = new Date(`1970-01-01T${relatedValue}:00`);

          // Logs des dates comparées
          console.log('Dates:', {
            valueDate: valueDate.toISOString(),
            relatedDate: relatedDate.toISOString(),
          });

          // Utiliser getTime() pour la comparaison
          const isValid = valueDate.getTime() > relatedDate.getTime();
          console.log(`Validation Result: ${isValid}`);
          return isValid; // Vérifie que l'heureFin est plus grande que l'heureDebut
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} doit être plus petite que ${args.property}`;
        },
      },
    });
  };
}



