import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { SessionService } from './services/session/session.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RejectUnauthorizedMiddleware } from './reject-unauthorized.middleware';
import { MinioClientService } from './services/minio/minio-client.service';
import MinioConfig from 'src/config/minio'
import { FileUploadService } from './services/minio/file-upload/file-upload.service';

const authorizedRoutes = ['user'];

@Module({
  imports: [
    MinioModule.register({
      endPoint: MinioConfig.endPoint,
      port: MinioConfig.port,
      useSSL: false,
      accessKey: MinioConfig.accessKey,
      secretKey: MinioConfig.secretKey
    })
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, SessionService, MinioClientService, FileUploadService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(...authorizedRoutes);
    consumer
      .apply(RejectUnauthorizedMiddleware)
      .forRoutes(...authorizedRoutes);
  }
}
