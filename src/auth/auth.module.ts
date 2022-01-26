import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TokenVerifyEmailSchema, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
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
  providers: [AuthService, JwtStrategy, SendEmailMiddleware],
  controllers: [AuthController],
})
export class AuthModule { }
