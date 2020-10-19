import { IUser } from '~/users/models/interfaces/user.interface';
import { TOKEN_OPTIONS } from '~/auth/auth.conf';
import { UserService } from '~/users/services/user.service';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TokenService } from '~/auth/services/token.service';
import { LoginInput } from '~/auth/dto/login.input';
import { ISession } from '~/auth/interface/session.interface';
import { UserInput } from '~/users/dto/user.input';
import { SALT_ROUNDS } from '~/commons/config/env';
import { getRndInteger } from '~/commons/utils';
import { ResetPasswordCredentials } from '../dto/reset-password-credentials';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {
  }


  async register(user: UserInput): Promise<ISession> {
    const found = await this.userService.findOne({ email: user.email });
    if (found) {
      throw new ConflictException("Email déjà utilisé");
    }
    const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
    user.password = await bcrypt.hash(user.password, salt);
    const createdUser: IUser = await this.userService.insertOne(user);
    const connectionToken: string = this.tokenService.sign(
      { sub: createdUser._id },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    createdUser.password = null;
    const session: ISession = { token: connectionToken, user: createdUser };
    return session;
  }

  async login(credentials: LoginInput): Promise<ISession> {
    const user = await this.userService.findOneOrFail({ email: credentials.email });
    const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordsMatch) {
      throw new NotFoundException('email or password not valid!');
    }
    const connectionToken: string = this.tokenService.sign(
      { sub: user._id },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    user.password = null;
    const session: ISession = { token: connectionToken, user: user };
    return session;
  }

  async startResetPassword(email: string): Promise<ResetPasswordCredentials> {
    const validationCode = getRndInteger(100000, 999999);
    const token = this.tokenService.sign(
      { sub: { email, validationCode: Number(validationCode) } },
      TOKEN_OPTIONS.connectionTokenOption,
    );
    return { token, validationCode };
  }

  // async sendResetPasswordEmail(email: string): Promise<string> {
  //   const defaultClient = SibApiV3Sdk.ApiClient.instance
  //   const apiKey = defaultClient.authentications['api-key']
  //   const apiInstance = new SibApiV3Sdk.SMTPApi()
  //   apiKey.apiKey = SIB_V3_API_KEY;
  //   const code = getRndInteger(1000, 9999);
  //   const resetToken: string = this.tokenService.sign(
  //     { sub: { email, code } },
  //     TOKEN_OPTIONS.connectionTokenOption,
  //   );
  //   let sendSmtpEmail = {
  //     to: [{ email }],
  //     templateId: 1,
  //     params: {
  //       code,
  //     }
  //   }
  //   apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  //     console.log('API called successfully. Returned data: ' + data);
  //   }, function(error) {
  //     console.error(error);
  //   });
  //   return resetToken;
  // }
  
}
