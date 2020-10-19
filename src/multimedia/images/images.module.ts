import { Module, forwardRef } from '@nestjs/common';
import { imageProviders } from '~/multimedia/images/images.providers';
import { ThumbnailImageService } from '~/multimedia/images/services/thumbnail-image.service';
import { UsersModule } from '~/users/user.module';
import { BookCoverService } from '~/multimedia/images/services/book-cover.service';
import { DatabaseModule } from '~/commons/database/database.module';
import { BookService } from '~/books/services/book.service';
import { BooksModule } from '~/books/book.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    DatabaseModule,
    forwardRef(() => BooksModule),
  ],
  providers: [
    BookCoverService,
    ThumbnailImageService,
    ...imageProviders,
  ],
  exports: [
    BookCoverService,
  ]
})
export class ImagesModule { }
