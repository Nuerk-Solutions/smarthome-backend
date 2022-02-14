import { users as Users } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: Users;
}
