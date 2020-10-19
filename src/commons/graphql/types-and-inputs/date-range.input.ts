import { ArgsType, Field, InputType, Int } from 'type-graphql';

@InputType()
export class DateRangeInput {
  @Field({ defaultValue: Date.now })
  public from?: Date;

  @Field({ nullable: true })
  public to?: Date;
}
