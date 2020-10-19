import { ContentType } from '~/commons/multimedia/typings/content-type';

export interface IncomingFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: ContentType;
  buffer: Buffer;
  size: number;
}
