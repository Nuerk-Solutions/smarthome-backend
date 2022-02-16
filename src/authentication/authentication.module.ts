import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    // Todo register Mail Service
    // forwardRef(() => MailModule),
    JwtModule.register({}),
  ],
  providers: [
    AuthenticationService,
    UserService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtConfirmTokenStrategy,
    // Todo register Mail Service
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
