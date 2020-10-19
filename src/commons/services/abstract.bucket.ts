import { Readable } from 'stream';
import { promisify } from 'util';
import { ObjectID } from 'bson';
import {
    isValidMongoId,
} from '~/commons/utils';
import {
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ImageSize } from '~/commons/multimedia/images/image-size';
import { imageFrameSize } from '~/commons/multimedia/images/image-frame-size';
import {
    MongooseGridFSBucketFile,
    MongooseGridFsModel,
} from '~/commons/typings/gridfs.typings';
import { readFileFromDB } from '~/commons/multimedia/utils';
import { Connection } from 'mongoose';
import { transformBufferToReadableStream } from '~/commons/multimedia/utils';

export abstract class AbstractBucket {
    protected abstractBucket: MongooseGridFsModel;
    protected modelName: string;
    protected connection: Connection;

    protected constructor(
        bucket: MongooseGridFsModel,
        modelName: string,
        connection: Connection,
    ) {
        this.abstractBucket = bucket;
        this.modelName = modelName;
        this.connection = connection;
    }

    public async findOneById(id: string): Promise<Readable> {
        if (!isValidMongoId(id)) {
            const message = 'Received arg is not a valid ObjectId!';
            throw new UnprocessableEntityException(message);
        }
        return readFileFromDB(id, this.modelName, this.connection).catch(
            (error: Error) => {
                throw new NotFoundException();
            },
        );
    }

    public async removeOneById(id: string): Promise<boolean> {
        // do not try to util.promisify bucket.unlink method, because you will get
        // Cannot read property 'findById' of undefined Error
        return new Promise((resolve, reject) => {
            this.abstractBucket.unlink(new ObjectID(id), error => {
                return error !== null ? reject(false) : resolve(true);
            });
        });
    }

    public async removeOneByIdOrFail(id: string): Promise<boolean> {
        const isRemoved = await this.removeOneById(id);
        if (isRemoved === false) {
            throw new NotFoundException();
        }
        return true;
    }

    public async removeManyByIds(ids: string[]): Promise<boolean[]> {
        const promises = ids.map(id => {
            return this.removeOneById(id);
        });
        return Promise.all(promises);
    }

    public getImageFrameSize(imageSize: ImageSize): number {
        return imageFrameSize[imageSize.toLowerCase()];
    }

    public async putFileToBucket(
        incomingFile,
        options = {
            filename: incomingFile.originalname,
        },
    ): Promise<MongooseGridFSBucketFile> {
        return new Promise(async (resolve, reject) => {
            const rs = transformBufferToReadableStream(incomingFile.buffer);

            this.abstractBucket.write(
                options,
                rs,
                (error: Error, writtenFile: MongooseGridFSBucketFile) => {
                    return error !== null ? reject(error) : resolve(writtenFile);
                },
            );
        });
    }

    
}
