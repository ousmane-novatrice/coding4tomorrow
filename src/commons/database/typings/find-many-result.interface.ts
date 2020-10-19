import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class FindManyResult<T> {
    @Field()
    recordsLength: number;

    @Field()
    totalRecords: number;

    @Field()
    records: T[];

    @Field()
    offset: number;

    @Field()
    limit: number;

    @Field()
    pages: number;

    @Field()
    currentPage: number;
}