import { Resolver } from "@nestjs/graphql";
import { User } from "~/users/dto/user.entity";
import { UserService } from "~/users/services/user.service";


@Resolver(of => User)
export class UserPropertyResolver {
    constructor(
        private readonly userService: UserService
    ) { }
}
