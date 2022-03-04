import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { LogbookModule } from './logbook/logbook.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './users/user.module';
import { MailModule } from './core/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { RecipeModule } from './recipe/recipe.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD')
        }
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'logbook',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'files',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MULTER_MONGO_DB')
      }),
      inject: [ConfigService]
    }),
    LogbookModule,
    UserModule,
    AuthenticationModule,
    MailModule,
    RecipeModule,
    FileModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
