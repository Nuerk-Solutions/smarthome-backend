import { Authentication, User } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithUserPayload extends Request {
  user: User & { authentication: Authentication };
}
