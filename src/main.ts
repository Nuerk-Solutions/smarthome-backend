import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import {ValidationPipe, VersioningType} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {AppModule} from './app.module';

async function bootstrap() {
    console.log('Server Ready!');

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    // const reflector = app.get(Reflector);
    const port = +configService.get<number>('WEB_PORT');

    app.use(helmet());
    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.enableCors();

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '2',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
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
