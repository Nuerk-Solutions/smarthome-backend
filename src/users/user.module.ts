import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './core/schemas/user.schema';
import { encodeString, generateHash } from '../core/utils/hash.util';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
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

            schema.pre('updateOne', async function (next) {
              const fields = this as any;
              const user = fields.getUpdate().$set;

              if (user['authentication.password']) {
                const password = await generateHash(user.authentication.password);
                // Check if the new password is the same as the old one
                if (password !== user.authentication.password) {
                  user.authentication.password = password;
                }
              }
              if (user['authentication.emailAddress']) {
                user.authentication.emailAddress = user.authentication.emailAddress.toLowerCase();
              }

              if (user['authentication.currentHashedRefreshToken']) {
                // the token is longer than 72 characters, so it needs to be encoded first with sha256
                const currentHashedRefreshToken = encodeString(user['authentication.currentHashedRefreshToken']);
                user['authentication.currentHashedRefreshToken'] = await generateHash(currentHashedRefreshToken);
              }
              this.updateOne({}, { $set: user });
              next();
            });
            return schema;
          },
        },
      ],
      'logbook',
    ),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
  controllers: [UserController],
})
export class UserModule {}
