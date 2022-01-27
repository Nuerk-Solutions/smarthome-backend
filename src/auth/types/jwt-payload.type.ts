import { Role } from '../../core/enums/role.enum';

export type JwtPayload = {
  sub: string;
  roles: Role[];
  email: string;
};
