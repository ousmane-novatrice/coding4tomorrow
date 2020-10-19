import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '~/commons/services/abstract.service';
import { IUser } from '~/users/models/interfaces/user.interface';
import { userModelName } from '~/users/models/namings/user.model-name';

@Injectable()
export class UserService extends AbstractService<IUser> {
    constructor(
        @InjectModel(userModelName) private readonly userModel: Model<IUser>
    ) {
        super(userModel);
    }
}
