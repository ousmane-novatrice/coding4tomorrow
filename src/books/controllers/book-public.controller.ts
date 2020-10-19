import { BookService } from "~/books/services/book.service";
import { IBook } from "~/books/models/interfaces/book.interface";
import { ClientFilterInput } from "~/commons/graphql/types-and-inputs/client-filter.input";
import { Body, Controller, Delete, Get, HttpStatus, Param, Res, UseGuards } from "@nestjs/common";
import { BookCoverService } from "~/multimedia/images/services/book-cover.service";
import { FetchBookCoverParam } from "../dto/fetchBookCover.param";
import { BookType } from "../enums/book-type.enum";

@Controller('public/book')
export class BookPublicController {
    constructor(
        private readonly bookService: BookService,
        private bookCoverService: BookCoverService
    ) { }

    @Get(':id')
    fetchBook(@Param('id') bookId: string): Promise<IBook> {
        return this.bookService.findOneOrFail({ _id: bookId, type: BookType.Public });
    }

    @Get()
    fetchBooks(
        @Body('clientFilter') clientFilter: ClientFilterInput,
    ): Promise<IBook[]> {
        return this.bookService.find({ type: BookType.Public }, clientFilter);
    }

    @Get('cover/:id')
    public async getCover(@Param() fetchBookCoverParam: FetchBookCoverParam, @Res() res): Promise<void> {
        const rs = await this.bookCoverService.findOneById(fetchBookCoverParam.id);
        if (rs === null) {
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }
        rs.pipe(res);
    }
}
