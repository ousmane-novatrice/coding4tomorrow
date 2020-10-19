import { Inject, Injectable } from '@nestjs/common';
import { bookCoverBucketName } from '~/multimedia/images/bucket-names';
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
import { BookService } from '~/books/services/book.service';
import { transformBufferToReadableStream } from '~/commons/multimedia/utils';

@Injectable()
export class BookCoverService extends AbstractBucket {
  constructor(
    @Inject(databaseConnectionName) connection: Connection,
    @Inject(bookCoverBucketName)
    private readonly bucket: MongooseGridFsModel,
    private readonly BookService: BookService,
  ) {
    super(bucket, bookCoverBucketName, connection);
  }

  public async rewriteBookCover(
    incomingFile: IncomingFile,
    bookId: string,
  ): Promise<ImageSizes> {
    const book = await this.BookService.findOneByIdOrFail(bookId);
    const lgImage = await this.writeBookCoverSize(
      incomingFile,
      ImageSize.Lg,
    );
    const mdImage = await this.writeBookCoverSize(
      incomingFile,
      ImageSize.Md,
    );
    const smImage = await this.writeBookCoverSize(
      incomingFile,
      ImageSize.Sm,
    );

    const bookCoverSizesObject: ImageSizes = {
      lg: lgImage._id,
      md: mdImage._id,
      sm: smImage._id,
    };

    await this.BookService.updateOneById(bookId, {
      cover: bookCoverSizesObject,
    });
    const previousBookCoversIds = Object.values(book.cover)
      .filter(id => id !== true)
      .filter(Boolean);

    // remove previous avatar images
    if (previousBookCoversIds.length) {
      await this.removeManyByIds(previousBookCoversIds);
    }

    return bookCoverSizesObject;
  }

  public async writeBookCoverSize(
    incomingFile,
    imageSize: ImageSize,
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
          purpose: FilePurpose.BookCover,
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
  }
}
