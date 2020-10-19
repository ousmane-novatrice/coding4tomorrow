import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '~/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseUrl } from '~/commons/database/database.url';
import { GraphQLModule } from '@nestjs/graphql';
import { GRAPHQL_PLAYGROUND } from '~/commons/config/env';
import { AuthModule } from '~/auth/auth.module';
import { BooksModule } from '~/books/book.module';

@Module({
  imports: [
    forwardRef(() => BooksModule),
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: true,
      playground: GRAPHQL_PLAYGROUND,
      installSubscriptionHandlers: true,
      context: async ({ req, connection }) => {
        if (connection) {
          // subscriptions
          return {
            req: {
              headers: { authorization: connection.context.Authorization },
            },
          };
        }
        // queries and mutations
        return { req };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
