import { Role } from 'src/core/enums/role.enum';

export interface JwtPayload {
  _id: string;
  roles: Role[];
  email: string;
}

export interface AuthLoginMetadata {
  accessToken: string;
  email: string;
  roles: Role[];
}
