import { Document } from 'mongoose';
import { BookType } from '~/books/enums/book-type.enum';
import { ImageSizes } from '~/commons/graphql/types-and-inputs/image-sizes.type';

export interface IBook extends Document {
    id: string;
    description?: string;
    title: string;
    author: string;
    publicationDate: Date;
    type: BookType;
    cover: ImageSizes;
}
