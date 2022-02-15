import { PrismaClient } from '.prisma/client';
import { INestApplication, Injectable } from '@nestjs/common';
import { authentications as Authentication } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { encodeString, generateHash } from '../utils/hash.util';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');

    super({
      datasources: {
        db: {
          url,
        },
      },
      errorFormat: 'pretty',
      rejectOnNotFound: true,
      log: ['query', 'info', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Middleware for hash the password
    this.$use(async (params, next) => {
      if (params.model == 'authentications') {
        // Create Action
        if (params.action == 'create') {
          const authentication: Authentication = params.args.data;
          if (authentication.password) {
            authentication.password = await generateHash(authentication.password);
          }
          if (authentication.emailAddress) {
            authentication.emailAddress = authentication.emailAddress.toLowerCase();
          }
          params.args.data = authentication;
        }

        // Update Action
        if (params.action == 'update') {
          const authentication: Authentication = params.args.data;
          if (authentication.password) {
            const password = await generateHash(authentication.password);
            // Todo: Check if this method works
            this.authentications.findUnique({ where: { id: authentication.id } }).then((currentAuthentication) => {
              if (password !== currentAuthentication.password) {
                authentication.password = password;
              }
            });

            if (authentication.currentHashedRefreshToken) {
              // the token is longer than 72 characters, so it needs to be encoded first with sha256
              const currentHashedRefreshToken = encodeString(authentication.currentHashedRefreshToken);
              authentication.currentHashedRefreshToken = await generateHash(currentHashedRefreshToken);
            }
          }
        }
        return next(params);
      }
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // teardown logic
    return Promise.all([this.users.deleteMany(), this.authentications.deleteMany()]);
  }
}
