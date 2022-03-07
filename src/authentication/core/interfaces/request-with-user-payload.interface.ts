import { Request } from 'express';
import { User } from '../../../users/core/schemas/user.schema';

export interface RequestWithUserPayload extends Request {
  user: User;
}
