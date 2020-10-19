import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from 'type-graphql';
import { ImageSizes } from '~/commons/graphql/types-and-inputs/image-sizes.type';
import { hasMinLength } from '~/commons/validators/has-min-length.validator';
import { BookType } from '../enums/book-type.enum';

@ObjectType()
export class Book {
    @Field(type => ID)
    id: string;

    @hasMinLength(1)
    @ApiProperty({ nullable: true })
    @Field({ nullable: true })
    description?: string;
    
    @hasMinLength(1)
    @ApiProperty()
    @Field()
    title: string;

    @hasMinLength(1)
    @ApiProperty()
    @Field()
    author: string;

    @ApiProperty()
    @Field()
    publicationDate: Date;

    @ApiProperty({ enum: Object.keys(BookType) })
    @Field(type => BookType)
    type: BookType;
    
    @Field(type => ImageSizes, { nullable: true })
    cover: ImageSizes;
}