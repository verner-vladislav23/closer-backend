import { Injectable } from '@nestjs/common';
import { User, getUserModel } from "src/models/User"

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
    public async create(user: User){
        const userModel = getUserModel();
        const userBd = await userModel.create(user);
    }

    /*public async findById(id: number): Promise<User | null> {
        const userModel = new User().getModelForClass(User);

        const user = await userModel.findById(id);
        return user;
    }*/
}

