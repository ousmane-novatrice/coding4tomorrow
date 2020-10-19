import { Inject, Injectable } from '@nestjs/common';
import { thumbnailImageBucketName } from '~/multimedia/images/bucket-names';
import {
  MongooseGridFSBucketFile,
  MongooseGridFsModel,
} from '~/commons/typings/gridfs.typings';
import { IncomingFile } from '~/multimedia/incoming-file';
import { ImageSize } from '~/multimedia/enums/image-size.enum';
import { FilePurpose } from '~/multimedia/enums/file-purpose.enum';
import { Jimp } from '~/commons/typings/jimp.typings';
import { ImageSizes } from '~/commons/graphql/types-and-inputs/image-sizes.type';
import { Connection } from 'mongoose';
import { AbstractBucket } from '~/commons/services/abstract.bucket';
import { databaseConnectionName } from '~/commons/database/database-connection-name';

@Injectable()
export class ThumbnailImageService extends AbstractBucket {
  constructor(
    @Inject(databaseConnectionName) connection: Connection,
    @Inject(thumbnailImageBucketName)
    private readonly bucket: MongooseGridFsModel,
  ) {
    super(bucket, thumbnailImageBucketName, connection);
  }
  /*public async rewriteThumbnailImage(
    incomingFile: IncomingFile,
    videoLessonId: string,
  ): Promise<ImageSizes> {
    const videoLesson = await this.videoLessonsService.findOneByIdOrFail(
      videoLessonId,
    );
    const lgImage = await this.writeThumbnailImageSize(
      incomingFile,
      ImageSize.Lg,
      videoLesson,
    );
    const mdImage = await this.writeThumbnailImageSize(
      incomingFile,
      ImageSize.Md,
      videoLesson,
    );
    const smImage = await this.writeThumbnailImageSize(
      incomingFile,
      ImageSize.Sm,
      videoLesson,
    );

    const thumbnailImageSizesObject: ImageSizes = {
      lg: lgImage._id,
      md: mdImage._id,
      sm: smImage._id,
    };
    await this.videoLessonsService.updateOneById(videoLessonId, {
      thumbnailImage: thumbnailImageSizesObject,
    });
    const previousThumbnailImagesIds = Object.values(videoLesson.thumbnail)
      .filter(id => id !== true)
      .filter(Boolean);

    // remove previous thumbnail images
    if (previousThumbnailImagesIds.length) {
      await this.removeManyByIds(previousThumbnailImagesIds);
    }

    return thumbnailImageSizesObject;
  }

  public async writeThumbnailImageSize(
    incomingFile,
    imageSize: ImageSize,
    videoLesson: IVideoLesson,
  ): Promise<MongooseGridFSBucketFile> {
    return new Promise(async (resolve, reject) => {
      const jimpImg = await Jimp.read(incomingFile.buffer);
      const frameSize = this.getImageFrameSize(imageSize);

      const imageBuff: Buffer = await jimpImg
        .cover(frameSize, frameSize)
        .quality(80)
        .getBufferAsync(Jimp.MIME_JPEG);

      const rs = transformBufferToReadableStream(imageBuff);
      const options = {
        filename: incomingFile.originalname,
        contentType: incomingFile.mimetype,
        metadata: {
          size: ImageSize,
          purpose: FilePurpose.ThumbnailImage,
        },
      };

      this.bucket.write(
        options,
        rs,
        (error: Error, writtenFile: MongooseGridFSBucketFile) => {
          return error !== null ? reject(error) : resolve(writtenFile);
        },
      );
    });
  }*/
}
