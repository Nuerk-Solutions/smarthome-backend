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
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/core/schemas/user.schema';
import { encodeString, generateHash } from '../core/utils/hash.util';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    forwardRef(() => MailModule),
    JwtModule.register({}),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            const user = this as any;
            if (user.authentication.isModified('password')) {
              user.authentication.password = await generateHash(user.authentication.password);
            }
            if (user.authentication.isModified('emailAddress')) {
              user.authentication.emailAddress = user.authentication.emailAddress.toLowerCase();
              next();
            }
          });

          schema.pre('update', async function (next) {
            const user = this as any;
            if (user.authentication.isModified('password')) {
              const password = await generateHash(user.authentication.password);
              // Check if the new password is the same as the old one
              if (password !== user.authentication.password) {
                user.authentication.password = password;
              }
            }
            if (user.authentication.isModified('emailAddress')) {
              user.authentication.emailAddress = user.authentication.emailAddress.toLowerCase();
            }

            if (user.authentication.isModified('currentHashedRefreshToken')) {
              // the token is longer than 72 characters, so it needs to be encoded first with sha256
              const currentHashedRefreshToken = encodeString(user.authentication.currentHashedRefreshToken);
              user.authentication.currentHashedRefreshToken = await generateHash(currentHashedRefreshToken);
            }
            next();
          });
          return schema;
        },
      },
    ]),
  ],
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
