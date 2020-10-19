import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { emailConstraint } from "~/commons/validators/constraints/constraints-message";

@InputType()
export class LoginInput {
    @IsEmail()
    @ApiProperty({ description: emailConstraint })
    @Field({ description: emailConstraint })
    email: string;

    @ApiProperty()
    @Field()
    password: string;
}
