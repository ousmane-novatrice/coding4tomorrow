import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UserService } from "~/users/services/user.service";
import { LoginInput } from "~/auth/dto/login.input";
import { AuthService } from "~/auth/services/auth.service";
import { TokenService } from "~/auth/services/token.service";
import { NotFoundException } from "@nestjs/common";
import { FinalizeResetPasswordInput } from "~/auth/dto/finalize-reset-password.input";
import { ISession } from "~/auth/interface/session.interface";
import { Session } from "~/auth/entities/session.entity";
import { UserInput } from "~/users/dto/user.input";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    @Query(returns => Session)
    login(
        @Args({ name: 'loginInput', type: () => LoginInput }) loginInput: LoginInput
    ): Promise<ISession> {
        return this.authService.login(loginInput);
    }

    @Mutation(returns => Session)
    register(
        @Args({ name: 'registerInput', type: () => UserInput }) registerDto: UserInput
    ): Promise<ISession> {
        return this.authService.register(registerDto); 
    }

    @Query(returns => String)
    async resetPassword(
        @Args({ name: 'email', type: () => String }) email: string,
    ): Promise<string> {
        await this.userService.findOneOrFail({ email });
        return 
        // return this.authService.sendResetPasswordEmail(email);
    }

    @Mutation(returns => Boolean)
    async updatePassword(
        @Args({ name: 'FinalizeResetPasswordInput', type: () => FinalizeResetPasswordInput }) FinalizeResetPasswordInput: FinalizeResetPasswordInput,
    ): Promise<boolean> {
        const payload = this.tokenService.verify(FinalizeResetPasswordInput.token);
        console.log(payload)
        if(!payload || payload.sub.validationCode !== FinalizeResetPasswordInput.validationCode) {
            throw new NotFoundException('Token expiré');
        } else {
            const user  = await this.userService.findOneOrFail({ email: payload.sub.email });
            await this.userService.updateOneById(user._id, { password: FinalizeResetPasswordInput.newPassword });
        }
        return true; 
    }

}