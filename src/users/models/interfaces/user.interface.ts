import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
