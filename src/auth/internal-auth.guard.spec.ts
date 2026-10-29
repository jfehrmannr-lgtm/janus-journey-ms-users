import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from '@jest/globals';
import { InternalAuthGuard } from './internal-auth.guard.js';

const createGuard = (apiKey: unknown = 'users-key'): InternalAuthGuard =>
  new InternalAuthGuard({ get: () => apiKey } as never);

const contextFor = (headers: Record<string, string>, path = '/users') => ({
  switchToHttp: () => ({ getRequest: () => ({ headers, path }) }),
});

describe('InternalAuthGuard', () => {
  it('allows valid internal authentication headers', () => {
    expect(
      createGuard().canActivate(
        contextFor({
          'x-api-key': 'users-key',
          'x-user-id': 'user-1',
        }) as never,
      ),
    ).toBe(true);
  });

  it.each([
    {},
    { 'x-user-id': 'user-1' },
    { 'x-api-key': 'invalid', 'x-user-id': 'user-1' },
    { 'x-api-key': 'users-key' },
    { 'x-api-key': 'users-key', 'x-user-id': ' ' },
  ])('rejects missing or invalid headers: %o', (headers) => {
    expect(() =>
      createGuard().canActivate(contextFor(headers) as never),
    ).toThrow(UnauthorizedException);
  });

  it('allows Swagger documentation without internal headers', () => {
    expect(createGuard().canActivate(contextFor({}, '/docs') as never)).toBe(
      true,
    );
    expect(
      createGuard().canActivate(contextFor({}, '/docs-json') as never),
    ).toBe(true);
  });

  it('requires a configured API key', () => {
    expect(() => createGuard('')).toThrow('MS_USERS_API_KEY is required');
  });
});
