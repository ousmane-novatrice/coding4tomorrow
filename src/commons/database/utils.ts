import { Connection } from 'mongoose';
import { MongooseGridFsModel } from '~/commons/typings/gridfs.typings';
import { createModel } from 'mongoose-gridfs';

export async function connectToBucket(
  connection: Connection,
  bucketName: string,
) {
    // setTimeout(()=>{
        return createModel({
          modelName: bucketName,
          connection: connection,
        }) as MongooseGridFsModel;
    // }, 5000);
}
