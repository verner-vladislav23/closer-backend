import { Controller, Post, Request} from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UserSession } from 'src/models/UserSession';


const _ = require('lodash');

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
            const session = new UserSession(data, token);
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
}
