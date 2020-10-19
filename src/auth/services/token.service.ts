import { Injectable } from '@nestjs/common';
import { AnyObject } from '~/commons/typings/typescript';
import { SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }
    public sign(payload: AnyObject, signOptions: SignOptions): string {
        return this.jwtService.sign(payload, signOptions);
    }

    public verify(token: string) {
        return this.jwtService.verify<AnyObject>(
            token,
        );
    }
}
