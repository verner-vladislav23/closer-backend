import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/models/User';
import { SessionService } from '../session/session.service';

const crypto = require('crypto');

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private sessionService: SessionService) {}

    /**
     * Validate User
     * @param username 
     * @param pass 
     */
    async validateUser(username: string, pass: string): Promise<boolean> {
        const user = await this.userService.findUser(username);

        if(!user) {
            return false;
        }

        const passwordHash = crypto.createHash('sha256').update(pass + user.salt).digest('base64');

        if(passwordHash != user.passwordHash) {
            return false;
        }

        return true;
    }

    async register(data: any):Promise<string | null> {

        const salt = crypto.randomBytes(32).toString('base64');
        const passwordHash = crypto.createHash('sha256').update(data.password + salt).digest('base64');

        const user = new User(
            data.firstname,
            data.lastname, 
            data.username, 
            passwordHash, 
            salt, 
            data.location
            );


        const userExists = await this.userService.findUser(user.username);

        if(userExists) {
            return null;
        } else {
            await this.userService.create(user);
            const token = this.getToken();
            await  this.sessionService.createSession(user, token);
            return token;
        }
    }

    getToken() {
        return crypto.randomBytes(32).toString('base64');
    }
}
