import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const configService = app.get(ConfigService);

  console.log('MAIL_USER:---', configService.get<string>('MAIL_USER'));
  console.log('MAIL_PASSWORD:', configService.get<string>('MAIL_PASSWORD'));
  await app.listen(3001);
  
}
bootstrap();
