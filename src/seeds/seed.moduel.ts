import { UserSeed } from './user.seed';
import { CommandModule } from 'nestjs-command';
import { TokenVerifyEmailSchema, UserSchema } from '../auth/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema },
    ]),
    CommandModule,
  ],
  providers: [UserSeed],
  exports: [UserSeed],
})
export class SeedsModule {}
