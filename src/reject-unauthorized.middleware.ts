import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';

/**
 * Rejects request with 401 Unauthorized status code if user'is not authorized
 * MUST BE used right after AuthMiddleware to work
 */
@Injectable()
export class RejectUnauthorizedMiddleware implements NestMiddleware {

  constructor(private authService : AuthService) {}

  async use(req: any, res: any, next: () => void) {

    if((await this.authService.user) === null) {
      return res.status(401).json({"status":"error","message":"unauthorized"});
    }

    next();
  }
}
