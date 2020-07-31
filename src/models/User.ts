// import {Entity, Column, ObjectIdColumn, ObjectID} from "typeorm";
import { prop, Typegoose, ModelType, InstanceType, index, Ref, arrayProp } from 'typegoose';
import * as mongoose from 'mongoose';
import { UserSession } from './UserSession';

class Location {
    @prop({ enum: ['Point'], required: true })
    public type?: String

    @prop({ required: true })
    public coordinates?: [Number, Number]

    // type: {
    //   type: String, // Don't do `{ location: { type: String } }`
    //   enum: ['Point'], // 'location.type' must be 'Point'
    //   required: true
    // },
    // coordinates: {
    //   type: [Number],
    //   required: true
    // }
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

    @prop({ required: true })
    public username?: string;

    @prop()
    public passwordHash: string;

    @prop()
    public salt: string;

    // @prop({ type: Number, dim: 2 })
    // @arrayProp({ items: Array })
    // location?: [[Number]]
    @prop()
    location: Location

    public _id: mongoose.Types.ObjectId;
}

const UserModel = new User().getModelForClass(User)

export { UserModel };


// @Entity()
// export class User {


//     @ObjectIdColumn()
//     id: ObjectID;

//     @Column()
//     firstName: string;

//     @Column()
//     lastName: string;

//     @Column()
//     username: string;

//     @Column()
//     passwordHash: string;


// }
