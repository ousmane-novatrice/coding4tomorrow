import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '~/commons/services/abstract.service';
import { IBook } from '~/books/models/interfaces/book.interface';
import { bookModelName } from '~/books/models/namings/book.model-name';

@Injectable()
export class BookService extends AbstractService<IBook> {
    constructor(
        @InjectModel(bookModelName) private readonly bookModel: Model<IBook>
    ) {
        super(bookModel);
    }
}
