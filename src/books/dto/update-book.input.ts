import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from 'type-graphql';
import { hasMinLength } from '~/commons/validators/has-min-length.validator';
import { BookType } from '~/books/enums/book-type.enum';
import { IsEnum } from 'class-validator';

@InputType()
export class UpdateBookInput {
    @ApiProperty({ nullable: true })
    @Field({ nullable: true })
    description?: string;
    
    @ApiProperty({ nullable: true })
    @Field()
    title: string;

    @ApiProperty({ nullable: true })
    @Field()
    author: string;

    @ApiProperty()
    @Field({ nullable: true })
    publicationDate: Date;

    @IsEnum(BookType)
    @ApiProperty({ enum: Object.keys(BookType) })
    @Field(type => BookType)
    type: BookType;
}
