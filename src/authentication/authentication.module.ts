import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../users/user.module';
import { LocalStrategy } from './core/strategies/local.strategy';
import { JwtAccessTokenStrategy } from './core/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './core/strategies/jwt-refresh-token.strategy';
import { JwtConfirmTokenStrategy } from './core/strategies/jwt-confirm-token.strategy';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../users/user.service';
import { MailModule } from '../core/mail/mail.module';
import { ApiKeyStrategy } from './core/strategies/api-key.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    forwardRef(() => MailModule),
    JwtModule.registerAsync({
      useFactory: () => ({}),
    }),
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthenticationService,
    UserService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtConfirmTokenStrategy,
    ApiKeyStrategy,
    {
      provide: 'MAIL_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
        }),
    },
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
