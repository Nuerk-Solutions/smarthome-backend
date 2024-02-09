import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { ApiKeyStrategy } from './core/strategies/api-key.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
  ],
  providers: [
    AuthenticationService,
    ApiKeyStrategy,
  ],
  exports: [AuthenticationService],
  controllers: [],
})
export class AuthenticationModule {}
