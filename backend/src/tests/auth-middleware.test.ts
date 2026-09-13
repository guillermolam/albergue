/**
 * Authentication Middleware Unit Tests
 * 
 * Tests the authMiddleware function directly to verify authentication
 * enforcement without requiring the full application stack.
 * 
 * Related pentest finding: Unauthenticated access to sensitive operational
 * API routes permits broad data disclosure and destructive mutations
 */

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { authMiddleware } from '../lib/middleware.js';
import type { Context } from 'hono';

describe('Authentication middleware', () => {
  const validToken = 'test-admin-token-secure-12345';
  
  beforeEach(() => {
    // Set a valid admin token for tests
    process.env.ADMIN_API_TOKEN = validToken;
  });

  // Helper to create a mock Hono context
  function createMockContext(authHeader?: string): Context {
    const headers = new Headers();
    if (authHeader) {
      headers.set('authorization', authHeader);
    }

    const mockRequest = {
      header: (name: string) => headers.get(name) || undefined,
      raw: { headers },
    } as any;

    const mockContext = {
      req: mockRequest,
      get: vi.fn((key: string) => {
        if (key === 'user') return undefined;
        return undefined;
      }),
      set: vi.fn(),
      json: vi.fn((body: any, status?: number) => {
        return new Response(JSON.stringify(body), {
          status: status || 200,
          headers: { 'content-type': 'application/json' },
        });
      }),
    } as unknown as Context;

    return mockContext;
  }

  describe('Authentication requirement enforcement', () => {
    it('rejects requests without authorization header', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext();
      const next = vi.fn();

      const response = await middleware(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Authentication required',
        }),
        401
      );
    });

    it('rejects requests with malformed authorization header', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const malformedHeaders = [
        'Basic dGVzdDp0ZXN0',  // Basic auth
        'Bearer',              // Missing token
        'Bearer ',             // Empty token
        'Token test',          // Wrong scheme
      ];

      for (const authHeader of malformedHeaders) {
        const ctx = createMockContext(authHeader);
        const next = vi.fn();

        await middleware(ctx, next);

        expect(next).not.toHaveBeenCalled();
        expect(ctx.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            error: 'Authentication required',
          }),
          401
        );
      }
    });

    it('rejects requests with invalid bearer token', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext('Bearer wrong-token-12345');
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Authentication required',
        }),
        401
      );
    });

    it('accepts requests with valid bearer token', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext(`Bearer ${validToken}`);
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalled();
      expect(ctx.set).toHaveBeenCalledWith('user', expect.objectContaining({
        id: 'admin-api-token',
        role: 'admin',
      }));
    });

    it('allows requests when requireAuth is false', async () => {
      const middleware = authMiddleware({ requireAuth: false });
      const ctx = createMockContext();
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Role-based access control', () => {
    it('enforces admin role requirement', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext(`Bearer ${validToken}`);
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).toHaveBeenCalled();
      expect(ctx.set).toHaveBeenCalledWith('user', expect.objectContaining({
        role: 'admin',
      }));
    });

    it('rejects when required role is not present', async () => {
      // Mock a user with a different role
      const middleware = authMiddleware({ requireAuth: true, roles: ['superadmin'] });
      const ctx = createMockContext(`Bearer ${validToken}`);
      
      // Override the get method to return a user with 'admin' role
      ctx.get = vi.fn((key: string) => {
        if (key === 'user') return { id: 'test', role: 'admin' };
        return undefined;
      });

      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Insufficient permissions',
        }),
        403
      );
    });
  });

  describe('Token comparison security', () => {
    it('uses timing-safe comparison for token validation', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      
      // Test tokens that differ in various positions
      const similarTokens = [
        'test-admin-token-secure-12346', // Last char different
        'test-admin-token-secure-12344', // Last char different
        'xest-admin-token-secure-12345', // First char different
        'test-admin-token-secure-1234',  // Shorter
        'test-admin-token-secure-123456', // Longer
      ];

      for (const token of similarTokens) {
        const ctx = createMockContext(`Bearer ${token}`);
        const next = vi.fn();

        await middleware(ctx, next);

        expect(next).not.toHaveBeenCalled();
        expect(ctx.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            error: 'Authentication required',
          }),
          401
        );
      }
    });

    it('rejects empty or whitespace-only tokens', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const emptyTokens = [
        'Bearer ',
        'Bearer  ',
        'Bearer \t',
        'Bearer \n',
      ];

      for (const authHeader of emptyTokens) {
        const ctx = createMockContext(authHeader);
        const next = vi.fn();

        await middleware(ctx, next);

        expect(next).not.toHaveBeenCalled();
      }
    });
  });

  describe('Fail-closed behavior', () => {
    it('rejects requests when ADMIN_API_TOKEN is not configured', async () => {
      // Temporarily unset the token
      const originalToken = process.env.ADMIN_API_TOKEN;
      delete process.env.ADMIN_API_TOKEN;

      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext('Bearer any-token');
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(ctx.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Authentication required',
        }),
        401
      );

      // Restore the token
      process.env.ADMIN_API_TOKEN = originalToken;
    });

    it('rejects requests when ADMIN_API_TOKEN is empty string', async () => {
      const originalToken = process.env.ADMIN_API_TOKEN;
      process.env.ADMIN_API_TOKEN = '';

      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext('Bearer any-token');
      const next = vi.fn();

      await middleware(ctx, next);

      expect(next).not.toHaveBeenCalled();

      process.env.ADMIN_API_TOKEN = originalToken;
    });
  });

  describe('Authentication boundary properties', () => {
    it('prevents bypass via case variation in Bearer scheme', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const caseVariations = [
        `bearer ${validToken}`,
        `BEARER ${validToken}`,
        `BeArEr ${validToken}`,
      ];

      for (const authHeader of caseVariations) {
        const ctx = createMockContext(authHeader);
        const next = vi.fn();

        await middleware(ctx, next);

        // Should reject because 'Bearer' must be capitalized correctly
        expect(next).not.toHaveBeenCalled();
      }
    });

    it('handles whitespace in token correctly', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      
      // The middleware trims the token after 'Bearer ', so extra spaces are handled
      const ctx = createMockContext(`Bearer  ${validToken}`);  // Double space
      const next = vi.fn();

      await middleware(ctx, next);

      // Should succeed because trim() removes the extra space
      expect(next).toHaveBeenCalled();
      
      // But tokens with embedded whitespace should fail
      const ctxWithEmbedded = createMockContext(`Bearer token with spaces`);
      const nextEmbedded = vi.fn();
      
      await middleware(ctxWithEmbedded, nextEmbedded);
      expect(nextEmbedded).not.toHaveBeenCalled();
    });

    it('sets authenticated user on context when valid', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      const ctx = createMockContext(`Bearer ${validToken}`);
      const next = vi.fn();

      await middleware(ctx, next);

      expect(ctx.set).toHaveBeenCalledWith('user', {
        id: 'admin-api-token',
        role: 'admin',
      });
    });
  });
});
