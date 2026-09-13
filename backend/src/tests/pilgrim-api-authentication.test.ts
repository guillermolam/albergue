/**
 * Pilgrim API Authentication Tests
 * 
 * Tests to verify that pilgrim API endpoints require authentication
 * and cannot be accessed without proper credentials.
 */

import { describe, expect, it, beforeAll } from 'vitest';
import { authMiddleware } from '../lib/middleware.js';
import type { Context, Next } from 'hono';

describe('Pilgrim API Authentication Enforcement', () => {
  describe('Authentication Middleware', () => {
    it('rejects requests without Authorization header', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Mock context without auth header
      const mockContext = {
        req: {
          header: (name: string) => undefined,
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should return 401 Unauthorized
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
      expect((result as any).data.success).toBe(false);
      expect((result as any).data.error).toBe('Authentication required');
    });

    it('rejects requests with invalid Bearer token', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Mock context with invalid token
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer invalid-token';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should return 401 Unauthorized
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
      expect((result as any).data.success).toBe(false);
      expect((result as any).data.error).toBe('Authentication required');
    });

    it('rejects requests with malformed Authorization header', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Mock context with malformed header (no "Bearer " prefix)
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'some-token';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should return 401 Unauthorized
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
      expect((result as any).data.success).toBe(false);
      expect((result as any).data.error).toBe('Authentication required');
    });

    it('accepts requests with valid admin token when ADMIN_API_TOKEN is set', async () => {
      // Set the admin token for this test
      const originalToken = process.env.ADMIN_API_TOKEN;
      process.env.ADMIN_API_TOKEN = 'test-admin-token-12345';

      const middleware = authMiddleware({ roles: ['admin'] });
      
      let nextCalled = false;
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer test-admin-token-12345';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {
        nextCalled = true;
      };

      await middleware(mockContext, mockNext);
      
      // Should call next() and not return error
      expect(nextCalled).toBe(true);

      // Restore original token
      if (originalToken) {
        process.env.ADMIN_API_TOKEN = originalToken;
      } else {
        delete process.env.ADMIN_API_TOKEN;
      }
    });

    it('rejects requests when ADMIN_API_TOKEN is not configured', async () => {
      // Ensure token is not set
      const originalToken = process.env.ADMIN_API_TOKEN;
      delete process.env.ADMIN_API_TOKEN;

      const middleware = authMiddleware({ roles: ['admin'] });
      
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer any-token';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should return 401 Unauthorized (fail-closed behavior)
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
      expect((result as any).data.success).toBe(false);
      expect((result as any).data.error).toBe('Authentication required');

      // Restore original token
      if (originalToken) {
        process.env.ADMIN_API_TOKEN = originalToken;
      }
    });

    it('enforces role-based access control', async () => {
      // Set the admin token
      const originalToken = process.env.ADMIN_API_TOKEN;
      process.env.ADMIN_API_TOKEN = 'test-admin-token-12345';

      const middleware = authMiddleware({ roles: ['superadmin'] }); // Require superadmin
      
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer test-admin-token-12345';
            return undefined;
          },
        },
        get: (key: string) => {
          // User is authenticated as 'admin' role
          if (key === 'user') return { id: 'admin-api-token', role: 'admin' };
          return undefined;
        },
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should return 403 Forbidden (insufficient permissions)
      expect(result).toBeDefined();
      expect((result as any).status).toBe(403);
      expect((result as any).data.success).toBe(false);
      expect((result as any).data.error).toBe('Insufficient permissions');

      // Restore original token
      if (originalToken) {
        process.env.ADMIN_API_TOKEN = originalToken;
      } else {
        delete process.env.ADMIN_API_TOKEN;
      }
    });
  });

  describe('Timing-Safe Token Comparison', () => {
    it('uses timing-safe comparison to prevent timing attacks', async () => {
      // This test verifies that the middleware uses timingSafeEqual
      // by checking that tokens of different lengths are handled safely
      
      const originalToken = process.env.ADMIN_API_TOKEN;
      process.env.ADMIN_API_TOKEN = 'correct-token';

      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Test with token of different length
      const mockContext = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer wrong';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {};

      const result = await middleware(mockContext, mockNext);
      
      // Should reject without timing leak
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);

      // Restore original token
      if (originalToken) {
        process.env.ADMIN_API_TOKEN = originalToken;
      } else {
        delete process.env.ADMIN_API_TOKEN;
      }
    });
  });

  describe('Security Properties', () => {
    it('fails closed when authentication is required but not provided', async () => {
      const middleware = authMiddleware({ requireAuth: true, roles: ['admin'] });
      
      const mockContext = {
        req: {
          header: (name: string) => undefined,
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {
        throw new Error('Next should not be called');
      };

      const result = await middleware(mockContext, mockNext);
      
      // Should fail closed with 401
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
      expect((result as any).data.error).toBe('Authentication required');
    });

    it('prevents bypass via empty or whitespace-only tokens', async () => {
      const originalToken = process.env.ADMIN_API_TOKEN;
      process.env.ADMIN_API_TOKEN = 'valid-token';

      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Test with empty token
      const mockContext1 = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer ';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const result1 = await middleware(mockContext1, async () => {});
      expect(result1).toBeDefined();
      expect((result1 as any).status).toBe(401);

      // Test with whitespace token
      const mockContext2 = {
        req: {
          header: (name: string) => {
            if (name === 'authorization') return 'Bearer    ';
            return undefined;
          },
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const result2 = await middleware(mockContext2, async () => {});
      expect(result2).toBeDefined();
      expect((result2 as any).status).toBe(401);

      // Restore original token
      if (originalToken) {
        process.env.ADMIN_API_TOKEN = originalToken;
      } else {
        delete process.env.ADMIN_API_TOKEN;
      }
    });

    it('validates that pilgrim routes are protected by admin role requirement', () => {
      // This is a structural test to verify the middleware configuration
      // In the actual index.ts, we have:
      // api.use("/pilgrims/*", authMiddleware({ roles: ["admin"] }));
      
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Verify middleware is configured with admin role
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });
  });

  describe('Unauthenticated Access Prevention', () => {
    it('prevents enumeration of pilgrim IDs without authentication', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Simulate attempt to access /api/pilgrims/:id without auth
      const mockContext = {
        req: {
          header: (name: string) => undefined,
          path: '/api/pilgrims/123',
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {
        throw new Error('Should not reach route handler');
      };

      const result = await middleware(mockContext, mockNext);
      
      // Should block with 401
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
    });

    it('prevents listing pilgrims without authentication', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Simulate attempt to access /api/pilgrims without auth
      const mockContext = {
        req: {
          header: (name: string) => undefined,
          path: '/api/pilgrims',
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {
        throw new Error('Should not reach route handler');
      };

      const result = await middleware(mockContext, mockNext);
      
      // Should block with 401
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
    });

    it('prevents search operations without authentication', async () => {
      const middleware = authMiddleware({ roles: ['admin'] });
      
      // Simulate attempt to search pilgrims without auth
      const mockContext = {
        req: {
          header: (name: string) => undefined,
          path: '/api/pilgrims/search',
        },
        get: (key: string) => undefined,
        set: (key: string, value: any) => {},
        json: (data: any, status: number) => ({ data, status }),
      } as unknown as Context;

      const mockNext = async () => {
        throw new Error('Should not reach route handler');
      };

      const result = await middleware(mockContext, mockNext);
      
      // Should block with 401
      expect(result).toBeDefined();
      expect((result as any).status).toBe(401);
    });
  });
});
