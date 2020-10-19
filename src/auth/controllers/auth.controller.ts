import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';
import { AuthService } from '~/auth/services/auth.service';
import { LoginInput } from '~/auth/dto/login.input';
import { Session } from '~/auth/entities/session.entity';
import { UserInput } from '~/users/dto/user.input';
import { UserService } from '~/users/services/user.service';
import { FinalizeResetPasswordInput } from '~/auth/dto/finalize-reset-password.input';
import { StartResetPasswordInput } from '~/auth/dto/start-reset-password.input';
import { TokenService } from '~/auth/services/token.service';
import { ResetPasswordCredentials } from '../dto/reset-password-credentials';
import { SALT_ROUNDS } from '~/commons/config/env';
const bcrypt = require('bcrypt');

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) { }

    @Post('register')
    register(@Body() user: UserInput): Promise<Session> {
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() credentials: LoginInput): Promise<Session> {
        return this.authService.login(credentials);
    }

    @Post('start-reset-password')
    async startResetPassword(
        @Body() startResetPasswordInput: StartResetPasswordInput
    ): Promise<ResetPasswordCredentials> {
        await this.userService.findOneOrFail({ email: startResetPasswordInput.email });
        return this.authService.startResetPassword(startResetPasswordInput.email);
    }

    @Post('finalize-reset-password')
    async finalizeResetPassword(
        @Body() finalizeResetPasswordInput: FinalizeResetPasswordInput,
    ): Promise<boolean> {
        const payload = this.tokenService.verify(finalizeResetPasswordInput.token);
        if(!payload || payload.sub.validationCode !== Number(finalizeResetPasswordInput.validationCode)) {
            throw new NotFoundException('Token expired');
        } else {
            const user  = await this.userService.findOneOrFail({ email: payload.sub.email });
            const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
            const password = await bcrypt.hash(finalizeResetPasswordInput.newPassword, salt);
            await this.userService.updateOneById(user._id, { password });
        }
        return true; 
    }
}
