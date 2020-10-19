import { registerEnumType } from 'type-graphql';

export enum OrderByDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

registerEnumType(OrderByDirection, {
  name: 'OrderByDirection',
  description: 'OrderBy direction',
});
