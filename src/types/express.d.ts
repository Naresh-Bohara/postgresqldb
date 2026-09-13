import { JwtPayload } from 'jsonwebtoken';

interface AuthUser extends JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
