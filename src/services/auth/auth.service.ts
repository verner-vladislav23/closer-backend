import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/models/User';
import { SessionService } from '../session/session.service';

const _ = require('lodash')

const crypto = require('crypto');

@Injectable()
export class AuthService {

    public authorizedUserID = null;

    public get user() : Promise<User | null> {
        return this.userService.findById(this.authorizedUserID);
    }

    constructor(private userService: UserService, private sessionService: SessionService) {}

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

        const passwordHash = await this.getHash(pass, user.salt);

        if (passwordHash != user.passwordHash) {
            return false;
        }

        return true;
    }

    async getHash(password: string, salt: string) {
        return crypto.createHash('sha256').update(password + salt).digest('base64');
    }

    async register(firstName: string, lastName: string, username: string, password: string): Promise<string | null> {

        const salt = crypto.randomBytes(32).toString('base64');
        const passwordHash = await this.getHash(password, salt);

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

    public async setAuthorizedUser(token: string | null) {
        this.authorizedUserID = null;
        const session = await this.sessionService.findSession(token);

        if(!session) {
            return;
        }

        const validated = await this.sessionService.validateSession(session);
        if(!validated) {
            await this.sessionService.deleteSession(session);
            return;
        }

        this.authorizedUserID = session.user_id;
    }

    getToken() {
        return crypto.randomBytes(32).toString('base64');
    }
}
