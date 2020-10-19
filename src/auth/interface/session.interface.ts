import { IUser } from "~/users/models/interfaces/user.interface";

export interface ISession {
    token: string;
    user: IUser;
}