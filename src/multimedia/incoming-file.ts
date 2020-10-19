import { ContentType } from '~/multimedia/enums/content-type.enum';

export interface IncomingFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: ContentType;
  buffer: Buffer;
  size: number;
}
