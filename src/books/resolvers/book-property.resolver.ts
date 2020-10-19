import { Resolver } from "@nestjs/graphql";
import { Book } from "~/books/dto/book.entity";
import { BookService } from "~/books/services/book.service";


@Resolver(of => Book)
export class BookPropertyResolver {
    constructor(
        private readonly bookService: BookService
    ) { }
}
