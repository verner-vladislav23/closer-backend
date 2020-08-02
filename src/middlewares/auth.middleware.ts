import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/services/auth/auth.service';
const _ = require('lodash')

/**
 * Sets logged user for AuthService
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService : AuthService) {}

  async use(req: Request, res: Response, next: Function) {
    
    const token = _.get(req.headers, 'x-auth-token', null);
    if(token !== null) {
      this.authService.user = await this.authService.getAuthorizedUser(token);
    }

    next();
  }
}