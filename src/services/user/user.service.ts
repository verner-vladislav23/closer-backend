import { Injectable } from '@nestjs/common';
import { Injectable, User } from "src/models/User"

@Injectable()
export class UserService {
    
    public async findOne(username:string): Promise<User | null> {
        const userModel = new User().getModelForClass(User);
        
        let user = await userModel.findOne({username: username});

        if (user === null) {
            return null;
        }
        else {
            return user;
        }
    }

    public async create
    
}

