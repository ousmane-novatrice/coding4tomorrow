import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Paging {
    @Field()
    recordsLength: number;

    @Field()
    totalRecords: number;

    @Field()
    offset: number;

    @Field()
    limit: number;

    @Field()
    pages: number;

    @Field()
    currentPage: number;
}