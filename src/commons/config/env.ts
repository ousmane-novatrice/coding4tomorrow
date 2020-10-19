import * as dotenv from 'dotenv';

dotenv.config();

export const MONGO_HOST = process.env.MONGO_HOST,
    MONGO_DB_NAME = process.env.MONGO_DB_NAME,
    MONGO_PORT = process.env.MONGO_PORT,
    MONGO_URL = process.env.MONGODB_URL,
    TOKEN_SECRET = process.env.TOKEN_SECRET,
    PORT = process.env.PORT,
    SIB_V3_API_KEY = process.env.SIB_V3_API_KEY,
    API_URL = process.env.API_URL,
    GRAPHQL_PLAYGROUND = Boolean(process.env.GRAPHQL_PLAYGROUND),
    SALT_ROUNDS = process.env.SALT_ROUNDS
    ;