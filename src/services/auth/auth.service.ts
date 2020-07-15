import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { UserSession } from "src/models/UserSession";

var crypto = require('crypto');

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ) {}

    async validateUser(username: string, pass: string): Promise<string | null> {
        const user = await this.userService.findOne(username);

        if(!user) {
            return null;
        }

        const passwordHash = crypto.createHash('sha256').update(pass + user.salt).digest('base64');

        if(passwordHash != user.passwordHash) {
            return null;
        }

        const payload = {username: user.username, sub: 'auth', id: user._id};
        const token = this.jwtService.sign(payload);

        const session = new UserSession(user, await token);

        //4e dalshe


        return token;
        
    }
}
