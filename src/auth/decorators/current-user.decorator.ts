import { createParamDecorator } from '@nestjs/common';
import { DecoratorContext } from '~/commons/typings/nest';
import { IncomingMessage } from 'http';
import { extractReqFromDecoratorContext } from '../utils';
import { attachedSessionProperty } from '../auth.contants';
import { ISession } from '~/auth/interface/session.interface';

export const CurrentUser = createParamDecorator(
  (pick: string, decoratorContext: DecoratorContext | IncomingMessage): any => {
    const req = extractReqFromDecoratorContext(decoratorContext);

    const sessionProp = 'session';
    const user = req[attachedSessionProperty] || req[sessionProp];
    return pick ? user && user[pick] : user;
  },
);
