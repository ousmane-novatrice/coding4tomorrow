import { Schema }  from 'mongoose';
import { BookType } from '~/books/enums/book-type.enum';
import { imageSizesNestedObject } from '~/commons/database/field-types/image-size-refs-hash.type';

export const bookSchema = new Schema({
  description: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: Object.keys(BookType),
    required: true
  },
  cover: imageSizesNestedObject,
});
