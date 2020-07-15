import { prop, Typegoose, ModelType, InstanceType, index, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import { User } from './User';

@index({token: "text"}, {unique: true})
export class UserSession extends Typegoose {
    
    @prop({ ref: User,
    foreignField: 'user',
    localField: '_id', })
    public user!: Ref<User>;

    @prop()
    public token?: string;

    constructor (user?: User, token?: string) {
        super();
        this.user = user;
        this.token = token;
    }

    public _id: mongoose.Types.ObjectId;
}