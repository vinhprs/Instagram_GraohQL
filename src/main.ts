import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(graphqlUploadExpress({maxFileSize: 99999999 ,maxFile: 10}));
  await app.listen(3000);
}
bootstrap();
