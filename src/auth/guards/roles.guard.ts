import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { rolesMetadataKey, attachedSessionProperty } from '~/auth/auth.contants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    public canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const routeRoles = this.reflector.get<string[]>(
            rolesMetadataKey,
            context.getHandler(),
        );

        if (!routeRoles) {
            return true;
        }

        const req =
            context.switchToHttp().getRequest() ||
            GqlExecutionContext.create(context).getContext().req;
        const user = req[attachedSessionProperty];

        return routeRoles.includes(user.role);
    }
}
