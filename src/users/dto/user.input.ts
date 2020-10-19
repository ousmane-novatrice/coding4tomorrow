import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { hasMinLength } from '~/commons/validators/has-min-length.validator';
import { InputType, Field } from 'type-graphql';
import { IsStrongPassword } from '~/commons/validators/is-strong-password.validator';
import { emailConstraint, hasMinLengthConstraint, passwordConstraint } from '~/commons/validators/constraints/constraints-message';

@InputType()
export class UserInput {
    @IsEmail()
    @ApiProperty({ required: true, description: emailConstraint })
    @Field({ description: emailConstraint })
    email: string;

    @hasMinLength(1)
    @ApiProperty({ required: true, minLength: 1, description: hasMinLengthConstraint(1) })
    @Field({ description: hasMinLengthConstraint(1) })
    firstName: string;

    @hasMinLength(1)
    @ApiProperty({ required: true, minLength: 1, description: hasMinLengthConstraint(1) })
    @Field({ description: hasMinLengthConstraint(1) })
    lastName: string;

    @IsStrongPassword()
    @ApiProperty({ required: true, minLength: 8, description: passwordConstraint })
    @Field({ description: passwordConstraint })
    password: string;
}
