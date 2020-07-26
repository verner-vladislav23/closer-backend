import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/models/User';
import { SessionService } from '../session/session.service';

const crypto = require('crypto');

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private sessionService: SessionService) { }

    /**
     * Validate User
     * @param username 
     * @param pass 
     */
    async validateUser(username: string, pass: string): Promise<boolean> {
        const user = await this.userService.findUser(username);

        if (!user) {
            return false;
        }

        const passwordHash = crypto.createHash('sha256').update(pass + user.salt).digest('base64');

        if (passwordHash != user.passwordHash) {
            return false;
        }

        return true;
    }

    async register(firstName: string, lastName: string, username: string, password: string): Promise<string | null> {

        const salt = crypto.randomBytes(32).toString('base64');
        const passwordHash = crypto.createHash('sha256').update(password + salt).digest('base64');

        let user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        user.passwordHash = passwordHash;
        user.salt = salt;

        const userExists = await this.userService.findUser(user.username);

        if (userExists) {
            return null;
        } else {
            user = await this.userService.create(user);
            const token = this.getToken();
            await this.sessionService.createSession(user._id, token);
            return token;
        }
    }

    async getAuthorizedUser(token: string): Promise<User | null> {
        const session = await this.sessionService.findSession(token);

        if(!session) {
            return null;
        }

        const validated = await this.sessionService.validateSession(session);
        if(!validated) {
            await this.sessionService.deleteSession(session);
            return null;
        }
        
        const user = this.userService.findById(session.user_id);
        return user;
    }

    getToken() {
        return crypto.randomBytes(32).toString('base64');
    }
}
