import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'));
  const configService = app.get(ConfigService);
  const port: string = configService.get('PORT');

  await app.listen(port, () => console.log(`Server running on port ${port}.`));
}
bootstrap();
