import { Readable } from 'stream';
import { ObjectID } from 'bson';
import { ContentType } from '~/commons/multimedia/typings/content-type';

export interface MongooseGridFSBucketReadStream extends Readable {
  s: any;
}

export interface MongooseGridFSBucketFile {
  _id: string;
  aliases: [];
  chunkSize: number;
  length: number;
  uploadDate: Date;
  md5: string;
  filename: string;
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongooseGridFsModel {
  write(
    options,
    rs: Readable,
    cb: (error: Error, writtenFile: MongooseGridFSBucketFile) => void,
  ): void;
  read({ _id: ObjectID }): void;
  unlink(id: ObjectID, cb: (error: Error) => void): void;
}
