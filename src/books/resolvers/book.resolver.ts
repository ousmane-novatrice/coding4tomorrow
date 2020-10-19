import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Book } from "~/books/dto/book.entity";
import { BookService } from "~/books/services/book.service";
import { IBook } from "~/books/models/interfaces/book.interface";
import { BookInput } from "~/books/dto/book.input";
import { UpdateBookInput } from "~/books/dto/update-book.input";
import { ID } from "type-graphql";
import { ClientFilterInput } from "~/commons/graphql/types-and-inputs/client-filter.input";


@Resolver()
export class BookResolver {
    constructor(
        private readonly bookService: BookService
    ) { }

    @Mutation(returns => Book)
    createBook(
        @Args({ name: 'bookInput', type: () => BookInput }) bookInput: BookInput,
    ): Promise<IBook> {
        return this.bookService.insertOne(bookInput);
    }

    @Mutation(returns => Book)
    updateBook(
        @Args({ name: 'bookId', type: () => ID }) bookId: string,
        @Args({ name: 'bookInput', type: () => UpdateBookInput }) bookInput: UpdateBookInput,
    ): Promise<IBook> {
        return this.bookService.updateOneById(bookId, bookInput);
    }

    @Query(returns => Book)
    fetchBook(
        @Args({ name: 'bookId', type: () => ID }) bookId: string,
    ): Promise<IBook> {
        return this.bookService.findOneByIdOrFail(bookId);
    }

    @Query(returns => [Book])
    fetchBooks(
        @Args({ name: 'clientFilter', type: () => ClientFilterInput }) clientFilter: ClientFilterInput,
    ): Promise<IBook[]> {
        return this.bookService.find({}, clientFilter);
    }

    @Mutation(returns => Boolean)
    removeBook(
        @Args({ name: 'bookId', type: () => ID }) bookId: string,
    ): Promise<boolean> {
        return this.bookService.removeOneByIdOrFail(bookId);
    }
}
