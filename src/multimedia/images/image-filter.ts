import { extname } from 'path';
import {
  allowedImageFormats,
  maxFileSizeForAvatars,
} from './images-restrictions';

export function imageFilter(req, file, callback) {
  const ext = extname(file.originalname).toLowerCase();
  if (parseInt(req.headers['content-length'], 10) > maxFileSizeForAvatars) {
    return callback(null, false);
  }
  if (!allowedImageFormats.includes(ext)) {
    return callback(null, false);
  }

  callback(null, true);
}
