import { JwtStrategy } from '~/auth/jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from '~/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_SECRET } from '~/commons/config/env';
import { TokenService } from './services/token.service';
import { AuthController } from './controllers/auth.controller';
import { AuthResolver } from '~/auth/resolvers/auth.resolver';
import { UsersModule } from '~/users/user.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: TOKEN_SECRET,
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtStrategy,
    TokenService,
    AuthResolver,
  ],
})
export class AuthModule { }
