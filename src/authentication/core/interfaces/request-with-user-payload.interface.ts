import { Request } from 'express';
import { User } from '../../../users/core/schemas/user.schema';
import { Authentication } from '../schemas/authentication.schema';

export interface RequestWithUserPayload extends Request {
  user: User & { authentication: Authentication };
}
