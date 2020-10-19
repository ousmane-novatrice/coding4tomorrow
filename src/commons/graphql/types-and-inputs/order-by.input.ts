import { Field, InputType } from 'type-graphql';
import { OrderByDirection } from '~/commons/graphql/types-and-inputs/order-by-direction';

@InputType()
export class OrderByInput {
  @Field()
  public property: string;

  @Field(type => OrderByDirection)
  public direction?: OrderByDirection | number;
}
