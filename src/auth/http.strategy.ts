import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public async validate(token: string) {
    let session = null;
    if (!session) {
      throw new UnauthorizedException();
    }
    return session;
  }
}
