import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as mongoose from 'mongoose';

import DatabaseConfig from './config/db';

async function bootstrap() {

  mongoose.connect(`mongodb://${DatabaseConfig.hostname}:${DatabaseConfig.port}/${DatabaseConfig.database}`, {
    auth: {
      user: DatabaseConfig.user ,
      password: DatabaseConfig.password
    }
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
