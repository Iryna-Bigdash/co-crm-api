import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const apiSecret = process.env.API_SECRET;
    if (!apiSecret) {
      if (process.env.NODE_ENV !== 'production') {
        return true;
      }
      throw new UnauthorizedException('API is not configured');
    }

    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'];

    if (key !== apiSecret) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
