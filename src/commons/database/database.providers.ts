import { mongoConnectionOptions } from '~/commons/typings/mongodb.typings';
import { databaseUrl } from '~/commons/database/database.url';
import { databaseConnectionName } from '~/commons/database/database-connection-name';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: databaseConnectionName,
    useFactory: async () => {
      return await mongoose.createConnection(
        databaseUrl,
        mongoConnectionOptions,
      );
    },
  },
];
