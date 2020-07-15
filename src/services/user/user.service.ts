import { Injectable } from '@nestjs/common';
import { User } from "src/models/User"

@Injectable()
export class UserService {
    
    public async findOne(username:string): Promise<User | null> {
        const userModel = new User().getModelForClass(User);
        
        let user = await userModel.findOne({username: username});

        return user;
    }



    public async findById(id: number): Promise<User | null> {
        const userModel = new User().getModelForClass(User);

        const user = await userModel.findById(id);
        return user;
    }
    //public async create
    
}

