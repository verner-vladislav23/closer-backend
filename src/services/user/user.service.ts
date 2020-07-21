import { Injectable } from '@nestjs/common';
import { User, getUserModel } from "src/models/User"
import { ObjectID } from 'mongodb';

@Injectable()
export class UserService {
    
    /**
     * Find user 
     * @param username 
     */
    public async findUser(username: string): Promise<User | null> {
        const userModel = getUserModel();
        const user = await userModel.findOne({username: username});

        return user;
    }

    /**
     * Create User
     * @param username 
     * @param password 
     */
    public async create(user: User): Promise<User | null>{
        const userModel = getUserModel();
        const userBD = await userModel.create(user);

        return userBD;
    }
    
    /**
     * Delete User by id
     * @param id 
     */
    public async deleteById(id: string) {
        const userModel = getUserModel();
        await userModel.deleteOne({id: id});
    }

    public async findById(id: ObjectID): Promise<User | null> {
        const userModel = getUserModel();

        const user = await userModel.findById(id);
        return user;
    }
}

