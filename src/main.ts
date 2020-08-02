import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as mongoose from 'mongoose';

import DatabaseConfig from 'src/config/db';
import CorsConfig from 'src/config/cors';

async function bootstrap() {

  mongoose.connect(`mongodb://${DatabaseConfig.hostname}:${DatabaseConfig.port}/${DatabaseConfig.database}`, {
    auth: {
      user: DatabaseConfig.user ,
      password: DatabaseConfig.password
    }
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsConfig);
  await app.listen(3000);
}

bootstrap();
