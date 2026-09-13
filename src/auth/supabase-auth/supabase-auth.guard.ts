import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthUser extends JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token required');
    }
    const token = authHeader.substring(7);
    if (!token) {
      throw new UnauthorizedException('Authentication token required');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT configuration is missing');
    }
    try {
      const decoded = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'],
      });
      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid authentication token');
      }
      const user = decoded as AuthUser;
      if (!user.sub) {
        throw new UnauthorizedException('Invalid authentication token');
      }
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
