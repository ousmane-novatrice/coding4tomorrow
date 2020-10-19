import { MONGO_URL, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } from '~/commons/config/env';

export function buildDatabaseUrl(): string {
    if(MONGO_URL === undefined) {
        console.log('MONGO_URL', `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`)
        return `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
    } 
    console.log('MONGO_URL', MONGO_URL);
    return MONGO_URL;
}