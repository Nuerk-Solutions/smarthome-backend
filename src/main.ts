import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Server Ready!');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const reflector = app.get(Reflector);
  const port = +configService.get<number>('WEB_PORT');

  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      skipMissingProperties: false,
      transform: true,
    }),
  );
  // Todo: Check error
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
