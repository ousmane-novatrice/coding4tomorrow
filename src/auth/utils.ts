
import { IncomingMessage } from 'http';
import { DecoratorContext } from '~/commons/typings/nest';
import { IExtendedRequest } from '~/commons/extended-request.interface';

export function extractReqFromDecoratorContext(
    decoratorContext: DecoratorContext | IncomingMessage,
): IExtendedRequest {
    return decoratorContext instanceof IncomingMessage
        ? decoratorContext
        : (decoratorContext[2].req as any);
}
