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

    @prop()
    private expires_at?: Date;

    constructor (user?: User, token?: string, expires_at?: Date) {
        super();
        this.user = user;
        this.token = token;
        this.expires_at = expires_at;
    }

    public _id: mongoose.Types.ObjectId;
}

export function getUserSessionModel() {
    return new UserSession().getModelForClass(UserSession);
}