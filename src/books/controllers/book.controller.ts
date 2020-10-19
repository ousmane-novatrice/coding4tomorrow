import { BookService } from "~/books/services/book.service";
import { BookInput } from "~/books/dto/book.input";
import { UpdateBookInput } from "~/books/dto/update-book.input";
import { Body, Controller, Delete, Param, Post, Put, Res, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageFilter } from "~/multimedia/images/image-filter";
import { IncomingFile } from "~/commons/multimedia/typings/incoming-file";
import { allowedImageFormats } from "~/multimedia/images/images-restrictions";
import { BookCoverService } from "~/multimedia/images/services/book-cover.service";
import { Book } from "~/books/dto/book.entity";
import { AuthGuard } from "~/auth/guards/auth-guard";

@UseGuards(AuthGuard)
@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private bookCoverService: BookCoverService
    ) { }

  @Post()
  @UseInterceptors(FileInterceptor('cover', { fileFilter: imageFilter }))
  public async createBook(
    @UploadedFile() file: IncomingFile,
    @Body() bookInput: BookInput,
  ): Promise<Book> {
    const book = await this.bookService.insertOne(bookInput);
    if (file === undefined) {
      const errorMessage = `Supported image formats: ${allowedImageFormats.join(
        ', ',
      )};`;
      throw new UnprocessableEntityException(errorMessage);
    }
    book.cover = await this.bookCoverService.rewriteBookCover(file, book.id);
    return book;
  }

    @Put(':id')
    @UseInterceptors(FileInterceptor('cover', { fileFilter: imageFilter }))
  public async updateBook(
    @UploadedFile() file: IncomingFile,
    @Body() bookInput: UpdateBookInput,
    @Param('id') bookId: string
  ): Promise<Book> {
    const book = await this.bookService.updateOneById(bookId, bookInput);
    if (file !== undefined) {
      book.cover = await this.bookCoverService.rewriteBookCover(file, book.id);
    }
    return book;
  }

    @Delete(':id')
    removeBook(
      @Param('id') bookId: string
    ): Promise<boolean> {
        return this.bookService.removeOneByIdOrFail(bookId);
    }
}
