import { Controller, Post, Request, Put, Response, Body } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { SessionService } from 'src/services/session/session.service';
import { UserService } from 'src/services/user/user.service';
import * as Schemes from 'src/schemes/user.schemes';
import responseStatus from '../responseStatus';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';


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
    async login(@Request() req, @Body(new JoiValidationPipe(Schemes.loginSchema)) body) {
        const data = req.body;
        const { username, password } = data;

        const userValidated = await this.authService.validateUser(username, password);

        if (userValidated) {
            const token = this.authService.getToken();
            const user = await this.userService.findUser(username);

            await this.sessionService.createSession(user._id, token);
            return { status: responseStatus.OK, data: token }
        }
        else {
            return { status: responseStatus.ERROR, message: 'Wrong username or password' };
        }
    }

    /**
     * Регистрация пользователя
     * @param req 
     */
    @Post('register')
    async register(@Request() req, @Body(new JoiValidationPipe(Schemes.registerSchema)) body) {
        const data = req.body;
        const { firstName, lastName, username, password } = data;

        const token = await this.authService.register(firstName, lastName, username, password);
        if (token) {
            return { status: responseStatus.OK, data: token }
        } else {
            return { status: responseStatus.ERROR, message: 'User already created' };
        }
    }

    @Post('logout')
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
        res.json({ status: responseStatus.ERROR, message: 'unauthorized' });
        res.send();
        return;
    }

}
