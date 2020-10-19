import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '~/users/services/user.service';
import { userModelName } from '~/users/models/namings/user.model-name';
import { userSchema } from '~/users/models/schemas/user.schema';
import { UserResolver } from '~/users/resolvers/user.resolver';
import { UserPropertyResolver } from '~/users/resolvers/user-property.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: userModelName, schema: userSchema },
    ]),
  ],
  providers: [
      UserService,
      UserResolver,
      UserPropertyResolver
  ],
  exports: [UserService]
})
export class UsersModule {}
