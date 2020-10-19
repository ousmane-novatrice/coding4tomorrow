import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { User } from "~/users/dto/user.entity";
import { UserService } from "~/users/services/user.service";
import { IUser } from "~/users/models/interfaces/user.interface";
import { UserInput } from "~/users/dto/user.input";
import { UpdateUserInput } from "~/users/dto/update-user.input";
import { ID } from "type-graphql";
import { ClientFilterInput } from "~/commons/graphql/types-and-inputs/client-filter.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "~/auth/guards/auth-guard";

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ) { }

    @Query(returns => User)
    fetchCurrentUser(
        @Args({ name: 'userId', type: () => ID }) userId: string,
    ): Promise<IUser> {
        return this.userService.findOneByIdOrFail(userId);
    }
}
