import { config } from 'dotenv';
import * as AWS from 'aws-sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

config();

async function bootstrap() {
  AWS.config.update({
    region: process.env.AWS_REGION,
    dynamodb: { endpoint: process.env.DB_URL }
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
