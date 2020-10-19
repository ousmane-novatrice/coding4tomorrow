import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { emailConstraint } from '~/commons/validators/constraints/constraints-message';

@InputType()
export class StartResetPasswordInput {
    @IsEmail()
    @ApiProperty({ description: emailConstraint })
    @Field({ description: emailConstraint })
    email: string;
}
