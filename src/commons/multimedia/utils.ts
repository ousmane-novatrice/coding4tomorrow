import { Readable } from 'stream';
import * as mongodb from 'mongodb';
import { ObjectId } from 'bson';
import { plural } from 'pluralize';
import { AnyObject } from '~/commons/typings/typescript';
import { Connection } from 'mongoose';

export function transformBufferToReadableStream(buff: Buffer): Readable {
    const readable = new Readable();
    readable._read = () => {
        /**/
    };
    readable.push(buff);
    readable.push(null);
    return readable;
}

export async function readFileFromDB(
    fileId: string,
    modelName: string,
    connection?: Connection,
): Promise<Readable> {
    const bucket = new mongodb.GridFSBucket(connection.db, {
        bucketName: plural(modelName),
    });

    const foundFilesCursor = await bucket.find({ _id: new ObjectId(fileId) });
    const foundFiles = (await foundFilesCursor.toArray()) as AnyObject[];
    if (foundFiles.length) {
        const file = foundFiles[0];
        return bucket.openDownloadStream(file._id);
    }
    return null;
}
