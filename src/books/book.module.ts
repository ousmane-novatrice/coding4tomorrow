import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from '~/books/services/book.service';
import { bookModelName } from '~/books/models/namings/book.model-name';
import { bookSchema } from '~/books/models/schemas/book.schema';
import { BookResolver } from '~/books/resolvers/book.resolver';
import { BookPropertyResolver } from '~/books/resolvers/book-property.resolver';
import { BookController } from '~/books/controllers/book.controller';
import { ImagesModule } from '~/multimedia/images/images.module';
import { BookPublicController } from '~/books/controllers/book-public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: bookModelName, schema: bookSchema },
    ]),
    forwardRef(() => ImagesModule)
  ],
  controllers: [BookController, BookPublicController],
  providers: [
      BookService,
      BookResolver,
      BookPropertyResolver,
  ],
  exports: [BookService]
})
export class BooksModule {}
