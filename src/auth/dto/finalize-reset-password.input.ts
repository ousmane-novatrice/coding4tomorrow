import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from 'type-graphql';
import { passwordConstraint } from '~/commons/validators/constraints/constraints-message';
import { IsStrongPassword } from '~/commons/validators/is-strong-password.validator';

@InputType()
export class FinalizeResetPasswordInput {
    @IsStrongPassword()
    @ApiProperty({ description: passwordConstraint })
    @Field()
    newPassword: string;

    @ApiProperty()
    @Field()
    token: string;

    @ApiProperty()
    @Field()
    validationCode: number;
}
