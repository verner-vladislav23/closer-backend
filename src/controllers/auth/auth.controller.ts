import { Controller, Post, Request, Put, Response } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import ResponseStatus from '../responseStatus'
import { SessionService } from 'src/services/session/session.service';
import { UserService } from 'src/services/user/user.service';
import * as Schemes from 'src/schemes/user.schemes';


const _ = require('lodash');

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private sessionService: SessionService,
        private userService: UserService) { }

    /**
     * Аутентификация пользователя
     * @param request
     */
    @Post('login')
    async login(@Request() req) {
        const data = req.body;

        try {
            await Schemes.loginSchema.validateAsync(data);
        } catch (exception) {
            return { status: ResponseStatus.ERROR, message: exception.details[0].message };
        }

        const { username, password } = data;

        const userValidated = await this.authService.validateUser(username, password);

        if (userValidated) {
            const token = this.authService.getToken();
            const user = await this.userService.findUser(username);

            await this.sessionService.createSession(user._id, token);
            return token;
        }
        else {
            return { status: ResponseStatus.ERROR, message: 'Wrong username or password' };
        }
    }

    /**
     * Регистрация пользователя
     * @param req 
     */
    @Post('register')
    async register(@Request() req) {
        const data = req.body;

        try {
            await Schemes.registerSchema.validateAsync(data);
        } catch (exception) {
            return { status: ResponseStatus.ERROR, message: exception.details[0].message };
        }

        const { firstName, lastName, username, password } = data;

        const token = await this.authService.register(firstName, lastName, username, password);
        if (token) {
            return token;
        }
        else {
            return { status: ResponseStatus.ERROR, message: 'User already created' };
        }
    }

    @Put('logout')
    async logout(@Request() req, @Response() res) {
        const authToken = _.get(req.headers, 'x-auth-token', null);

        if (authToken !== null) {
            let session = await this.sessionService.findSession(authToken);
            if (session !== null) {
                await this.sessionService.deleteSession(session);
                res.json({ status: 'ok' });
                res.send();
                return;
            }
        }

        res.status(401);
        res.json({ status: ResponseStatus.ERROR, message: 'unauthorized' });
        res.send();
        return;
    }

}
