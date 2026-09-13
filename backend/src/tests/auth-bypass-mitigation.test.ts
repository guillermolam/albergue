/**
 * Security Tests: Unauthenticated Collection Root Access Mitigation
 * 
 * These tests verify that the pentest finding "Unauthenticated exact collection 
 * roots expose privileged data and permit user creation" has been properly mitigated.
 * 
 * The vulnerability was that admin middleware was only applied to `/users/*`, 
 * `/audit-log/*`, and `/government-submissions/*` (with wildcard), but not to 
 * the exact collection roots (`/users`, `/audit-log`, `/government-submissions`).
 * 
 * The fix applies authMiddleware to both the exact roots and their descendants.
 */

import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index.js';

describe('Collection root authorization bypass mitigation', () => {
  const validAdminToken = process.env.ADMIN_API_TOKEN || 'test-admin-token-12345';
  const invalidToken = 'invalid-token-xyz';

  beforeAll(() => {
    // Ensure ADMIN_API_TOKEN is set for tests
    if (!process.env.ADMIN_API_TOKEN) {
      process.env.ADMIN_API_TOKEN = validAdminToken;
    }
  });

  describe('GET /api/users - exact collection root', () => {
    it('rejects unauthenticated requests to exact collection root', async () => {
      const response = await app.request('/api/users');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid bearer token to exact collection root', async () => {
      const response = await app.request('/api/users', {
        headers: {
          'Authorization': `Bearer ${invalidToken}`,
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('allows authenticated admin requests to exact collection root', async () => {
      const response = await app.request('/api/users', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('POST /api/users - exact collection root', () => {
    it('rejects unauthenticated user creation at exact collection root', async () => {
      const response = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'attacker-user',
          password: 'malicious-password',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects user creation with invalid token at exact collection root', async () => {
      const response = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${invalidToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'attacker-user',
          password: 'malicious-password',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('allows authenticated admin to create users at exact collection root', async () => {
      const response = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin-created-user',
          password: 'secure-password',
        }),
      });

      // Should not be 401 or 403 (may be 400/500 if validation/DB fails, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('GET /api/audit-log - exact collection root', () => {
    it('rejects unauthenticated requests to audit log collection root', async () => {
      const response = await app.request('/api/audit-log');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token to audit log collection root', async () => {
      const response = await app.request('/api/audit-log', {
        headers: {
          'Authorization': `Bearer ${invalidToken}`,
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('allows authenticated admin requests to audit log collection root', async () => {
      const response = await app.request('/api/audit-log', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('GET /api/government-submissions - exact collection root', () => {
    it('rejects unauthenticated requests to government submissions collection root', async () => {
      const response = await app.request('/api/government-submissions');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token to government submissions collection root', async () => {
      const response = await app.request('/api/government-submissions', {
        headers: {
          'Authorization': `Bearer ${invalidToken}`,
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('allows authenticated admin requests to government submissions collection root', async () => {
      const response = await app.request('/api/government-submissions', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('Descendant routes still protected', () => {
    it('rejects unauthenticated requests to /api/users/:id', async () => {
      const response = await app.request('/api/users/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated requests to /api/audit-log/:id', async () => {
      const response = await app.request('/api/audit-log/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated requests to /api/government-submissions/:id', async () => {
      const response = await app.request('/api/government-submissions/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Security properties verification', () => {
    it('ensures no credential leakage in error responses', async () => {
      const response = await app.request('/api/users');
      const body = await response.json();

      // Verify response doesn't leak sensitive information
      const responseText = JSON.stringify(body);
      expect(responseText).not.toMatch(/password/i);
      expect(responseText).not.toMatch(/hash/i);
      expect(responseText).not.toMatch(/credential/i);
      expect(responseText).not.toMatch(/verifier/i);
    });

    it('enforces admin role requirement for all three collection roots', async () => {
      const endpoints = [
        '/api/users',
        '/api/audit-log',
        '/api/government-submissions',
      ];

      for (const endpoint of endpoints) {
        const response = await app.request(endpoint);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.error).toBe('Authentication required');
      }
    });

    it('applies consistent authorization to both exact roots and wildcard descendants', async () => {
      const testCases = [
        { path: '/api/users', description: 'exact root' },
        { path: '/api/users/1', description: 'descendant' },
        { path: '/api/audit-log', description: 'exact root' },
        { path: '/api/audit-log/1', description: 'descendant' },
        { path: '/api/government-submissions', description: 'exact root' },
        { path: '/api/government-submissions/1', description: 'descendant' },
      ];

      for (const testCase of testCases) {
        const response = await app.request(testCase.path);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });

    it('prevents unauthorized data enumeration via collection roots', async () => {
      // Attempt to access all three privileged collection roots without auth
      const privilegedEndpoints = [
        '/api/users',
        '/api/audit-log',
        '/api/government-submissions',
      ];

      for (const endpoint of privilegedEndpoints) {
        const response = await app.request(endpoint);
        
        // Must not return 200 OK with data
        expect(response.status).not.toBe(200);
        
        // Must return 401 Unauthorized
        expect(response.status).toBe(401);
        
        const body = await response.json();
        
        // Must not contain a data field with collection results
        expect(body.data).toBeUndefined();
        
        // Must contain authentication error
        expect(body.error).toBe('Authentication required');
      }
    });

    it('prevents unauthorized write operations via collection roots', async () => {
      // Attempt to POST to users collection root without auth
      const response = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'unauthorized-user',
          password: 'should-not-be-created',
        }),
      });

      // Must not return 201 Created
      expect(response.status).not.toBe(201);
      
      // Must return 401 Unauthorized
      expect(response.status).toBe(401);
      
      const body = await response.json();
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Timing-safe token comparison', () => {
    it('takes similar time for valid and invalid tokens', async () => {
      // This test verifies that the middleware uses timing-safe comparison
      // to prevent timing attacks that could leak token information
      
      const iterations = 5;
      const validTimes: number[] = [];
      const invalidTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        // Test with valid token
        const validStart = Date.now();
        await app.request('/api/users', {
          headers: {
            'Authorization': `Bearer ${validAdminToken}`,
          },
        });
        validTimes.push(Date.now() - validStart);

        // Test with invalid token
        const invalidStart = Date.now();
        await app.request('/api/users', {
          headers: {
            'Authorization': `Bearer ${invalidToken}`,
          },
        });
        invalidTimes.push(Date.now() - invalidStart);
      }

      // Calculate averages
      const avgValid = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
      const avgInvalid = invalidTimes.reduce((a, b) => a + b, 0) / invalidTimes.length;

      // The difference should be relatively small (within 50ms)
      // This is a heuristic check - timing-safe comparison should prevent
      // significant timing differences
      const timingDifference = Math.abs(avgValid - avgInvalid);
      expect(timingDifference).toBeLessThan(50);
    });
  });

  describe('Authorization header validation', () => {
    it('rejects malformed authorization headers', async () => {
      const malformedHeaders = [
        'Basic dXNlcjpwYXNz', // Basic auth instead of Bearer
        'Bearer', // Missing token
        'Bearer ', // Empty token
        'bearer token', // Wrong case
        'Token abc123', // Wrong scheme
      ];

      for (const authHeader of malformedHeaders) {
        const response = await app.request('/api/users', {
          headers: {
            'Authorization': authHeader,
          },
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        expect(body.error).toBe('Authentication required');
      }
    });

    it('rejects requests with no authorization header', async () => {
      const response = await app.request('/api/users', {
        headers: {},
      });

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Authentication required');
    });
  });
});
