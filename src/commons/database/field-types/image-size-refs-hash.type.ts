import { ImageSize } from '~/multimedia/enums/image-size.enum';

const hash = {};

Object.keys(ImageSize).forEach(size => {
  const hashKey = size.toLowerCase();
  hash[hashKey] = String;
});

export const imageSizesNestedObject = hash;
