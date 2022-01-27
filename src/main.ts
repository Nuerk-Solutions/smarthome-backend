import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {RequestContextMiddleware} from './core/middleware/request-context.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Request');
    app.use(helmet());
    app.enableCors();
    app.use(RequestContextMiddleware.rawExpressMiddleware);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            enableDebugMessages: true,
            skipMissingProperties: false,
            transform: true,
        }),
    );
    await app.listen(3000);
}

bootstrap();
