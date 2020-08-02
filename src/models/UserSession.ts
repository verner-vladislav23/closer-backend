import { prop, Typegoose, ModelType, InstanceType, index, Ref } from 'typegoose';
import * as mongoose from 'mongoose';

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

const UserSessionModel = new UserSession().getModelForClass(UserSession);
export default UserSessionModel;