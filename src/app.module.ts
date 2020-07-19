import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { SessionService } from './services/session/session.service';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, SessionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('auth');
  }
}
