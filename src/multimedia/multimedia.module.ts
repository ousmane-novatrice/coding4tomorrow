import { Module } from '@nestjs/common';
import { ImagesModule } from '~/multimedia/images/images.module';

@Module({
  imports: [ImagesModule],
})
export class MultimediaModule {}
