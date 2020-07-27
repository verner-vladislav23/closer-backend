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
        const user = await userModel.findOne({ username: username });

        return user;
    }

    public async findNear(user: User) {
        const userModel = getUserModel();

        const usersFound = userModel.find({
            _id: { $ne: user._id },
            location:
            {
                $near:
                {
                    $geometry: user.location,
                    $minDistance: 0,
                    $maxDistance: 50
                }
            }
        });
        return usersFound;
    }

    /**
     * Create User
     * @param username 
     * @param password 
     */
    public async create(user: User): Promise<User | null> {
        const userModel = getUserModel();
        const userBD = await userModel.create(user);

        return userBD;
    }

    public async update(user: User) {
        const userModel = getUserModel();

        await userModel.updateOne({
            _id: user._id
        },
            {
                $set: {
                    location: user.location
                }
            }
        );
    }


    /**
     * Delete User by id
     * @param id 
     */
    public async deleteById(id: string) {
        const userModel = getUserModel();
        await userModel.deleteOne({ id: id });
    }

    public async findById(id: ObjectID): Promise<User | null> {
        const userModel = getUserModel();

        const user = await userModel.findById(id);
        return user;
    }
}

