import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from 'type-graphql';
import { User } from "~/users/dto/user.entity";
import { IUser } from "~/users/models/interfaces/user.interface";

@ObjectType()
export class Session {
    @ApiProperty()
    @Field()
    token: string;

    @ApiProperty({ type: User })
    @Field(type => User)
    user: IUser;
}