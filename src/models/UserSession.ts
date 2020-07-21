import { prop, Typegoose, ModelType, InstanceType, index, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import { User } from './User';

@index({token: "text"}, {unique: true})
export class UserSession extends Typegoose {
    
    public _id: mongoose.Types.ObjectId;

    @prop()
    public user_id: mongoose.Types.ObjectId;

    @prop()
    public token?: string;

    @prop()
    public expires_at?: Date;
}

export function getUserSessionModel() {
    return new UserSession().getModelForClass(UserSession);
}