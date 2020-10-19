import { ObjectOfPrimitives } from '~/commons/typings/typescript';

export class ValidationException {
  public children: any[];
  public constraints: ObjectOfPrimitives;
  public property: string;
  public target: ObjectOfPrimitives;
  public value: any;
}
