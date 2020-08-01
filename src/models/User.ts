import { prop, Typegoose, ModelType, InstanceType, index, Ref, arrayProp } from 'typegoose';
import * as mongoose from 'mongoose';
import { UserSession } from './UserSession';

class Location {
    @prop({ enum: ['Point'] })
    public type: string

    @prop()
    public coordinates: [number, number]
}

@index({ location: '2dsphere' })
@index({ username: "text" }, { unique: true })
export class User extends Typegoose {

    public getSessions = () => {
        const UserSessionModel = new UserSession().getModelForClass(UserSession);
    }
    @prop()
    public email: string;

    @prop()
    public firstName: string;

    @prop()
    public lastName: string;

    @prop()
    public username: string;

    @prop()
    public passwordHash: string;

    @prop()
    public salt: string;

    @prop()
    location: Location

    public _id: mongoose.Types.ObjectId;
}

const UserModel = new User().getModelForClass(User)
export default UserModel;