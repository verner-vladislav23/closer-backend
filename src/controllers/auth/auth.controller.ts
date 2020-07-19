import { Controller, Post, Request, Put, Response} from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UserSession } from 'src/models/UserSession';
import { SessionService } from 'src/services/session/session.service';
import { UserService } from 'src/services/user/user.service';


const _ = require('lodash');

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private sessionService: SessionService, private userService: UserService) {}

    /**
     * Аутентификация пользователя
     * @param request
     */
    @Post('login')
    async login(@Request() req)
    {
        const data = req.body;

        if(!_.has(data, 'username') || !_.has(data, 'password')) {
            return {status: 'error', message: 'Fill in all the fields'};
        }

        const {username, password} = data;
        
        const userValidated = await this.authService.validateUser(username, password);

        if(userValidated) {
            const token = this.authService.getToken();
            const user = await this.userService.findUser(username);

            await this.sessionService.createSession(user, token);

            return token;
        }
        else {
            return {status: 'error', message: 'Wrong username or password'};
        }
    }

    /**
     * Регистрация пользователя
     * @param req 
     */
    @Post('register')
    async register(@Request() req)
    {
        const data = req.body;
        if(!_.has(data, 'username') || !_.has(data, 'password')) {
            return {status: 'error', message: 'Fill in all the fields'};
        }

        
        const token = await this.authService.register(data);

        if(token) {
            return token;
        }
        else {
            return {status: 'error', message: 'User already created'};
        }
    }

    @Put('logout')
    async logout(@Request() req, @Response() res)
    {
        const authToken = _.get(req.headers, 'x-auth-token', null);

        if(authToken !== null) {
            let session = await this.sessionService.findSession(authToken);
            if(session !== null) {
                await this.sessionService.deleteSession(session);
                res.json({status: 'ok'});
                res.send();
                return;
            }
        }

        res.status(401);
        res.json({status: 'error', message: 'unauthorized'});
        res.send();
        return;
    }

}
