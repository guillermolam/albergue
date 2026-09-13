/**
 * Authentication Enforcement Tests
 * 
 * Verifies that the unauthenticated access vulnerability has been mitigated.
 * 
 * Pentest Finding: Unauthenticated access to database-backed business routers
 * 
 * The fix moves authentication middleware from specific route prefixes to a global
 * "/*" pattern that protects all routes except /auth, which is mounted before the
 * middleware is applied.
 * 
 * These tests verify:
 * 1. Public routes (/auth/*) remain accessible without authentication
 * 2. Protected routes (pilgrims, bookings, beds, payments, etc.) require authentication
 * 3. Unauthenticated requests to protected routes return 401
 * 4. Authenticated requests to protected routes succeed
 */

import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index.js';

describe('Authentication Enforcement - Pentest Mitigation', () => {
  let validToken: string | undefined;

  beforeAll(() => {
    // Use the configured admin token if available
    validToken = process.env.ADMIN_API_TOKEN;
  });

  describe('Public routes (no authentication required)', () => {
    it('allows access to /api/auth/login without authentication', async () => {
      const response = await app.request('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'nonexistent',
          password: 'wrong',
        }),
      });

      // Should not return 401 (authentication required)
      // May return 401 for invalid credentials, but not for missing auth
      expect(response.status).not.toBe(401);
      // Expect either 400 (bad request) or 401 (invalid credentials), not auth required
      expect([400, 401]).toContain(response.status);
    });

    it('allows access to root endpoint without authentication', async () => {
      const response = await app.request('/');
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it('allows access to health check without authentication', async () => {
      const response = await app.request('/health');
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  describe('Protected routes - Pilgrims (Step 3, 11, 12 from pentest)', () => {
    it('blocks unauthenticated GET /api/pilgrims (collection enumeration)', async () => {
      const response = await app.request('/api/pilgrims');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated GET /api/pilgrims/:id (detail access)', async () => {
      const response = await app.request('/api/pilgrims/1');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PUT /api/pilgrims/:id (update mutation)', async () => {
      const response = await app.request('/api/pilgrims/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Attacker',
          lastName: 'Modified',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated DELETE /api/pilgrims/:id (soft delete)', async () => {
      const response = await app.request('/api/pilgrims/1', {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/pilgrims (creation)', async () => {
      const response = await app.request('/api/pilgrims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Attacker',
          lastName: 'Created',
          email: 'attacker@example.com',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Bookings (Step 4, 5, 6 from pentest)', () => {
    it('blocks unauthenticated GET /api/bookings (collection enumeration)', async () => {
      const response = await app.request('/api/bookings');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/bookings (booking creation with caller-selected IDs)', async () => {
      const response = await app.request('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pilgrimId: 1,
          bedId: 1,
          checkInDate: '2024-01-01',
          checkOutDate: '2024-01-02',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PATCH /api/bookings/:id/status (status mutation)', async () => {
      const response = await app.request('/api/bookings/1/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated GET /api/bookings/:id (detail access)', async () => {
      const response = await app.request('/api/bookings/1');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Beds (Step 8, 9, 10, 13 from pentest)', () => {
    it('blocks unauthenticated GET /api/beds (collection enumeration)', async () => {
      const response = await app.request('/api/beds');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated GET /api/beds/:id (detail access with ID exposure)', async () => {
      const response = await app.request('/api/beds/1');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PUT /api/beds/:id (bed update mutation)', async () => {
      const response = await app.request('/api/beds/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: 999,
          isAvailable: true,
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PATCH /api/beds/:id/reserve (bed reservation)', async () => {
      const response = await app.request('/api/beds/1/reserve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservedUntil: '2024-12-31T23:59:59Z',
          status: 'reserved',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PATCH /api/beds/:id/release (bed release)', async () => {
      const response = await app.request('/api/beds/1/release', {
        method: 'PATCH',
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/beds/cleanup-expired (cleanup operation)', async () => {
      const response = await app.request('/api/beds/cleanup-expired', {
        method: 'POST',
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated DELETE /api/beds/:id (bed deletion)', async () => {
      const response = await app.request('/api/beds/1', {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Payments', () => {
    it('blocks unauthenticated GET /api/payments', async () => {
      const response = await app.request('/api/payments');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/payments', async () => {
      const response = await app.request('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: 1,
          amount: 100,
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Pricing', () => {
    it('blocks unauthenticated GET /api/pricing', async () => {
      const response = await app.request('/api/pricing');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated PUT /api/pricing/:id', async () => {
      const response = await app.request('/api/pricing/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: 0,
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Notifications', () => {
    it('blocks unauthenticated GET /api/notifications', async () => {
      const response = await app.request('/api/notifications');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/notifications', async () => {
      const response = await app.request('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email',
          recipient: 'attacker@example.com',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Users', () => {
    it('blocks unauthenticated GET /api/users', async () => {
      const response = await app.request('/api/users');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/users', async () => {
      const response = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'attacker',
          password: 'password',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Audit Log', () => {
    it('blocks unauthenticated GET /api/audit-log', async () => {
      const response = await app.request('/api/audit-log');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Protected routes - Government Submissions', () => {
    it('blocks unauthenticated GET /api/government-submissions', async () => {
      const response = await app.request('/api/government-submissions');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('blocks unauthenticated POST /api/government-submissions', async () => {
      const response = await app.request('/api/government-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: 'sensitive',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Authenticated access (when token is configured)', () => {
    it('allows authenticated GET /api/pilgrims when valid token is provided', async () => {
      if (!validToken) {
        console.log('Skipping authenticated test: ADMIN_API_TOKEN not configured');
        return;
      }

      const response = await app.request('/api/pilgrims', {
        headers: {
          'Authorization': `Bearer ${validToken}`,
        },
      });
      
      // Should not return 401 (authentication required)
      expect(response.status).not.toBe(401);
      // May return 200 (success) or other errors (DB issues, etc.)
      // The key is that authentication passed
    });

    it('allows authenticated GET /api/bookings when valid token is provided', async () => {
      if (!validToken) {
        console.log('Skipping authenticated test: ADMIN_API_TOKEN not configured');
        return;
      }

      const response = await app.request('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${validToken}`,
        },
      });
      
      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/beds when valid token is provided', async () => {
      if (!validToken) {
        console.log('Skipping authenticated test: ADMIN_API_TOKEN not configured');
        return;
      }

      const response = await app.request('/api/beds', {
        headers: {
          'Authorization': `Bearer ${validToken}`,
        },
      });
      
      expect(response.status).not.toBe(401);
    });

    it('rejects requests with invalid token', async () => {
      const response = await app.request('/api/pilgrims', {
        headers: {
          'Authorization': 'Bearer invalid-token-12345',
        },
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests with malformed authorization header', async () => {
      const response = await app.request('/api/pilgrims', {
        headers: {
          'Authorization': 'NotBearer token',
        },
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });

  describe('Security boundary verification', () => {
    it('ensures authentication is checked before route handlers execute', async () => {
      // This test verifies that even with valid-looking request bodies,
      // the authentication check happens first
      const response = await app.request('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pilgrimId: 1,
          bedId: 1,
          checkInDate: '2024-01-01',
          checkOutDate: '2024-01-02',
        }),
      });
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Authentication required');
      // Should not get validation errors or database errors - auth fails first
    });

    it('prevents enumeration of sensitive data through collection endpoints', async () => {
      // Verify that pilgrims collection (containing PII) is protected
      const response = await app.request('/api/pilgrims?page=1&pageSize=100');
      
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Authentication required');
      // Should not return any pilgrim data
      expect(body.data).toBeUndefined();
    });

    it('prevents caller-controlled ID mutations without authentication', async () => {
      // Verify that ID-based mutations are blocked
      const testCases = [
        { method: 'PUT', path: '/api/pilgrims/1', body: { firstName: 'Test' } },
        { method: 'DELETE', path: '/api/pilgrims/1', body: null },
        { method: 'PATCH', path: '/api/bookings/1/status', body: { status: 'cancelled' } },
        { method: 'PUT', path: '/api/beds/1', body: { isAvailable: false } },
        { method: 'PATCH', path: '/api/beds/1/reserve', body: { reservedUntil: '2024-12-31' } },
      ];

      for (const testCase of testCases) {
        const response = await app.request(testCase.path, {
          method: testCase.method,
          headers: testCase.body ? { 'Content-Type': 'application/json' } : {},
          body: testCase.body ? JSON.stringify(testCase.body) : undefined,
        });
        
        expect(response.status).toBe(401);
        const body = await response.json();
        expect(body.error).toBe('Authentication required');
      }
    });
  });
});
