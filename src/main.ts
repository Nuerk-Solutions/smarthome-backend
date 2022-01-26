import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import morgan from "morgan";
import { AppModule } from "./app.module";
import { RequestContextMiddleware } from "./core/middleware/request-context.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Request");
  app.use(helmet());
  app.enableCors();
  app.use(RequestContextMiddleware.rawExpressMiddleware);
  app.use(
    morgan("short", {
      stream: {
        write: (message) => logger.log(message.replace("\n", ""))
      }
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      skipMissingProperties: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
