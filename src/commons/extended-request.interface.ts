import { Request } from 'express';
import { ISession } from '~/auth/interface/session.interface';
import { AnyObject } from '~/commons/typings/typescript';
export interface IExtendedRequest extends Request {
  session: ISession;
  locals: AnyObject;
}
