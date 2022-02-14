import { authentications as Authentication, users as User } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User & { authentication: Authentication };
}
