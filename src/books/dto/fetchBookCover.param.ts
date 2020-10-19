import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class FetchBookCoverParam {
    @IsMongoId()
    @ApiProperty({ description: 'Must be book.cover.md or book.cover.lg or book.cover.sm for medium, large and small size' })
    @Field()
    id: string;
}
