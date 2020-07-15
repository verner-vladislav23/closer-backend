import { Controller, Post, Request} from '@nestjs/common';
import { AuthService } from "src/services/auth/auth.service";


var _ = require('lodash');

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Авторизация
     * @param request
     */
    @Post('auth/login')
    async login(@Request() req)
    {
        const data = req.body;
        if(!_.has(data, 'username') || !_.has(data, 'password')) {
            return {status: 'error', message: 'Заполните все поля'};
        }
        
        const token = await this.authService.validateUser(data.username, data.password);

        if(token) {
            return token;
        }
        else {
            return {status: 'error', message: 'Неправильный логин или пароль'};
        }
    }

    /**
     * Регистрация пользователя
     * @param req 
     */
    @Post('auth/register')
    async register(@Request() req: Request)
    {
        //
        const token = "da";
        return token;
    }
}
