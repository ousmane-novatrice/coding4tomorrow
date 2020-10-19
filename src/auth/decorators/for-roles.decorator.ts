import { SetMetadata } from '@nestjs/common';
import { rolesMetadataKey } from '~/auth/auth.contants';

export const ForRoles = (...roles: string[]) =>
    SetMetadata(rolesMetadataKey, roles);
