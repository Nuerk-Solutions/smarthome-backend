import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenVerifyEmailSchema, UserSchema } from './schemas/user.schema';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema },
    ]),
    //PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({}),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'mail.nuerk-solutions.de',
          port: 465,
          secure: true,
          auth: { user: 'info@nuerk-solutions.de', pass: 'K557024b' },
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: '"info@nuerk-solutions.de" <info@nuerk-solutions.de>',
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, AuthTokenStrategy, RefreshTokenStrategy, SendEmailMiddleware],
  controllers: [AuthController],
})
export class AuthModule {}
