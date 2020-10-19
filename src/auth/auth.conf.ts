import { day, hour, minute, year } from '~/commons/time';
import { Options } from 'generate-password';
import { SignOptions } from 'jsonwebtoken';

export const VALIDATION_CODE_MAX_LENGTH = 4;

export const VALIDATION_CODE_CONFIG: Options = {
         length: VALIDATION_CODE_MAX_LENGTH,
         numbers: true,
       };

export const TOKEN_OPTIONS: {
         validationCodeTokenOption: SignOptions;
         connectionTokenOption: SignOptions;
         resetPasswordTokenOption: SignOptions,
       } = {
         validationCodeTokenOption: { expiresIn: `${10 * minute}` },
         connectionTokenOption: { expiresIn: `${5 * year}` },
         resetPasswordTokenOption: { expiresIn: `${2 * hour}` },
       };