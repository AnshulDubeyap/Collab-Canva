import { UserSession } from '../../interface/UserSession';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserSession {}
  }
}
