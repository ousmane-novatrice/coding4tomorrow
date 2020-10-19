import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ResetPasswordCredentials {
    @ApiProperty()
    @Field()
    token: string;

    @ApiProperty()
    @Field()
    validationCode: number;
}
