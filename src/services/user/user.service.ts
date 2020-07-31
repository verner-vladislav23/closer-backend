import { Injectable } from '@nestjs/common';
import { User, UserModel } from 'src/models/User'
import { ObjectID } from 'mongodb';

@Injectable()
export class UserService {

    /**
     * Find user 
     * @param username 
     */
    public async findUser(username: string): Promise<User | null> {
        const userModel = UserModel;
        const user = await userModel.findOne({ username: username });

        return user;
    }

    /**
     * Find users near
     * @param user 
     */
    public async findNear(user: User) {
        const userModel = UserModel;

        const usersFound = await userModel.find({
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
     * Cast DB user to schema user
     * @param user 
     */
    public castUser(user: User) {
        return {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    }

    /**
     * Create User
     * @param username 
     * @param password 
     */
    public async create(user: User): Promise<User | null> {
        const userModel = UserModel;
        const userBD = await userModel.create(user);

        return userBD;
    }


    /**
     * Update user location
     * @param user 
     */
    public async updateUserLocation(user: User) {
        const userModel = UserModel;

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
        const userModel = UserModel;
        await userModel.deleteOne({ id: id });
    }

    public async findById(id: ObjectID): Promise<User | null> {
        const userModel = UserModel;

        const user = await userModel.findById(id);
        return user;
    }
}

