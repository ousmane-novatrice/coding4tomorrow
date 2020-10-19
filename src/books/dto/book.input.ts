import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum } from 'class-validator';
import { hasMinLength } from '~/commons/validators/has-min-length.validator';
import { InputType, Field } from 'type-graphql';
import { ImageSizes } from '~/commons/graphql/types-and-inputs/image-sizes.type';
import { IncomingFile } from '~/commons/multimedia/typings/incoming-file';
import { BookType } from '../enums/book-type.enum';

@InputType()
export class BookInput {
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

    @IsEnum(BookType)
    @ApiProperty({ enum: Object.keys(BookType) })
    @Field(type => BookType)
    type: BookType;
}
