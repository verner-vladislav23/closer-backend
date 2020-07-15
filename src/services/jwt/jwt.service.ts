import { Injectable } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service'

var jwt = require('jsonwebtoken');

@Injectable()
export class JwtService {

    constructor(private userService: UserService) {}
    /**
     * Создание токена
     * @param payload 
     */
    async sign(payload: any): Promise<string>{
        const signature = 'otkuda';

        return jwt.sign(payload, signature, {expiresIn: '90d'});
    }

    /**
     * Верификация токена
     * @param token 
     */
    async verifyToken(token: string) {
        
        const decoded = jwt.verify(token, );

        const user = this.userService.findById(decoded.id);

        if(!user){
            return false;
        }
        else {
            return true;
        }
    }
}
