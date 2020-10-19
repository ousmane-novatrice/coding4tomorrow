import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { getRequestFromContext } from '~/commons/utils';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    public getRequest(context: ExecutionContext) {
        return getRequestFromContext(context);
    }
}
