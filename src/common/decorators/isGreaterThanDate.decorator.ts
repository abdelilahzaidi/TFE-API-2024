import { registerDecorator } from 'class-validator';

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