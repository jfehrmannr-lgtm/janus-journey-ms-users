import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { timingSafeEqual } from 'node:crypto';

const API_KEY_HEADER = 'x-api-key';
const USER_ID_HEADER = 'x-user-id';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('MS_USERS_API_KEY');

    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('MS_USERS_API_KEY is required');
    }

    this.apiKey = apiKey.trim();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.isSwaggerRequest(request)) return true;

    const apiKey = this.headerValue(request, API_KEY_HEADER);
    if (!apiKey || !this.hasMatchingApiKey(apiKey)) {
      throw new UnauthorizedException('Internal authentication is required');
    }

    if (request.method === 'POST') return true;

    const userId = this.headerValue(request, USER_ID_HEADER);

    if (!userId || userId.trim() === '') {
      throw new UnauthorizedException('Internal authentication is required');
    }

    return true;
  }

  private headerValue(request: Request, name: string): string | undefined {
    const value = request.headers[name];
    return typeof value === 'string' ? value : undefined;
  }

  private hasMatchingApiKey(value: string): boolean {
    const provided = Buffer.from(value);
    const configured = Buffer.from(this.apiKey);

    return (
      provided.length === configured.length &&
      timingSafeEqual(provided, configured)
    );
  }

  private isSwaggerRequest(request: Request): boolean {
    return (
      request.path === '/docs-json' ||
      request.path === '/docs' ||
      request.path.startsWith('/docs/')
    );
  }
}
