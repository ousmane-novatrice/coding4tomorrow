import { Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
export abstract class TimestampsTypeSegment {
  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}
