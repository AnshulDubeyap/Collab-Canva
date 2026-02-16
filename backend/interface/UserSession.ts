import { UserRole } from '../enums/userRole';

export interface UserSession {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  googleId?: string;
}
