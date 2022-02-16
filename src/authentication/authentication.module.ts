import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './core/strategies/local.strategy';
import { JwtAccessTokenStrategy } from './core/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './core/strategies/jwt-refresh-token.strategy';
import { JwtConfirmTokenStrategy } from './core/strategies/jwt-confirm-token.strategy';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../users/user.service';
import { MailModule } from '../core/mail/mail.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [UserModule, PassportModule, ConfigModule, forwardRef(() => MailModule), JwtModule.register({})],
  providers: [
    AuthenticationService,
    UserService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtConfirmTokenStrategy,
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
