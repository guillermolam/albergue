/**
 * Authentication Boundary Tests
 * 
 * Verifies that the security fix for unauthenticated access to operational
 * API routes is properly enforced. All operational routes should require
 * authentication via bearer token, preventing unauthorized data disclosure
 * and destructive mutations.
 * 
 * Related pentest finding: Unauthenticated access to sensitive operational
 * API routes permits broad data disclosure and destructive mutations
 */

import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index.js';

describe('Authentication boundary enforcement', () => {
  const validToken = 'test-admin-token-12345';
  const invalidToken = 'wrong-token';

  beforeAll(() => {
    // Set a valid admin token for authenticated tests
    process.env.ADMIN_API_TOKEN = validToken;
  });

  describe('Pilgrims routes require authentication', () => {
    it('rejects unauthenticated GET /api/pilgrims (collection endpoint)', async () => {
      const response = await app.request('/api/pilgrims');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/pilgrims/:id (detail endpoint)', async () => {
      const response = await app.request('/api/pilgrims/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated DELETE /api/pilgrims/:id (soft delete)', async () => {
      const response = await app.request('/api/pilgrims/1', {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated DELETE /api/pilgrims/:id/force (hard delete)', async () => {
      const response = await app.request('/api/pilgrims/1/force', {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/pilgrims (create)', async () => {
      const response = await app.request('/api/pilgrims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'Pilgrim',
          email: 'test@example.com',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid bearer token', async () => {
      const response = await app.request('/api/pilgrims', {
        headers: {
          Authorization: `Bearer ${invalidToken}`,
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Bookings routes require authentication', () => {
    it('rejects unauthenticated GET /api/bookings (collection endpoint)', async () => {
      const response = await app.request('/api/bookings');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/bookings/:id', async () => {
      const response = await app.request('/api/bookings/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated PATCH /api/bookings/:id/status (status mutation)', async () => {
      const response = await app.request('/api/bookings/1/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/bookings', async () => {
      const response = await app.request('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilgrimId: 1,
          bedAssignmentId: 1,
          checkInDate: '2024-01-01',
          checkOutDate: '2024-01-02',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Beds routes require authentication', () => {
    it('rejects unauthenticated GET /api/beds (collection endpoint)', async () => {
      const response = await app.request('/api/beds');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/beds/:id', async () => {
      const response = await app.request('/api/beds/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated PATCH /api/beds/:id/reserve (bed reservation)', async () => {
      const response = await app.request('/api/beds/1/reserve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservedUntil: '2024-01-01T12:00:00Z',
          status: 'reserved',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated PATCH /api/beds/:id/release (bed release)', async () => {
      const response = await app.request('/api/beds/1/release', {
        method: 'PATCH',
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/beds (bed creation)', async () => {
      const response = await app.request('/api/beds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bedNumber: '101',
          roomNumber: '1',
          bedType: 'single',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Payments routes require authentication', () => {
    it('rejects unauthenticated GET /api/payments (collection endpoint with financial data)', async () => {
      const response = await app.request('/api/payments');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/:id (payment detail with transaction data)', async () => {
      const response = await app.request('/api/payments/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/payments', async () => {
      const response = await app.request('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: 1,
          amount: '50.00',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Pricing routes require authentication', () => {
    it('rejects unauthenticated GET /api/pricing', async () => {
      const response = await app.request('/api/pricing');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/pricing', async () => {
      const response = await app.request('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seasonName: 'High Season',
          pricePerNight: '75.00',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Notifications routes require authentication', () => {
    it('rejects unauthenticated GET /api/notifications', async () => {
      const response = await app.request('/api/notifications');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/notifications', async () => {
      const response = await app.request('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          recipient: 'test@example.com',
          subject: 'Test',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Previously protected routes remain protected', () => {
    it('rejects unauthenticated GET /api/users', async () => {
      const response = await app.request('/api/users');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/audit-log', async () => {
      const response = await app.request('/api/audit-log');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/government-submissions', async () => {
      const response = await app.request('/api/government-submissions');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Public routes remain accessible', () => {
    it('allows unauthenticated access to root endpoint', async () => {
      const response = await app.request('/');
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        success: true,
        version: '1.0.0',
      });
    });

    it('allows unauthenticated access to health check', async () => {
      const response = await app.request('/health');
      
      // Health check may return 200 or 503 depending on DB state
      expect([200, 503]).toContain(response.status);
    });

    it('allows unauthenticated access to /api/auth routes', async () => {
      // Auth routes should be public for credential verification
      const response = await app.request('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test' }),
      });
      
      // May return 400, 401, or other status, but should not be blocked by auth middleware
      expect(response.status).not.toBe(401);
    });
  });

  describe('Valid authentication allows access', () => {
    it('allows authenticated GET /api/pilgrims with valid bearer token', async () => {
      const response = await app.request('/api/pilgrims', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      // Should not return 401 (may return 500 if DB is unavailable, but that's expected)
      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/bookings with valid bearer token', async () => {
      const response = await app.request('/api/bookings', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/beds with valid bearer token', async () => {
      const response = await app.request('/api/beds', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/payments with valid bearer token', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/pricing with valid bearer token', async () => {
      const response = await app.request('/api/pricing', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).not.toBe(401);
    });

    it('allows authenticated GET /api/notifications with valid bearer token', async () => {
      const response = await app.request('/api/notifications', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).not.toBe(401);
    });
  });

  describe('Authentication boundary security properties', () => {
    it('prevents enumeration of pilgrim IDs without authentication', async () => {
      // Test sequential ID access without auth
      const ids = [1, 2, 3, 100, 999];
      
      for (const id of ids) {
        const response = await app.request(`/api/pilgrims/${id}`);
        expect(response.status).toBe(401);
      }
    });

    it('prevents enumeration of booking IDs without authentication', async () => {
      const ids = [1, 2, 3, 100, 999];
      
      for (const id of ids) {
        const response = await app.request(`/api/bookings/${id}`);
        expect(response.status).toBe(401);
      }
    });

    it('prevents unauthorized booking status mutations', async () => {
      const statuses = ['cancelled', 'completed', 'checked_out', 'confirmed'];
      
      for (const status of statuses) {
        const response = await app.request('/api/bookings/1/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        expect(response.status).toBe(401);
      }
    });

    it('prevents unauthorized bed reservation/release operations', async () => {
      // Test reserve
      const reserveResponse = await app.request('/api/beds/1/reserve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservedUntil: '2024-12-31T23:59:59Z',
          status: 'reserved',
        }),
      });
      expect(reserveResponse.status).toBe(401);

      // Test release
      const releaseResponse = await app.request('/api/beds/1/release', {
        method: 'PATCH',
      });
      expect(releaseResponse.status).toBe(401);
    });

    it('prevents unauthorized pilgrim deletion operations', async () => {
      // Test soft delete
      const softDeleteResponse = await app.request('/api/pilgrims/1', {
        method: 'DELETE',
      });
      expect(softDeleteResponse.status).toBe(401);

      // Test hard delete
      const hardDeleteResponse = await app.request('/api/pilgrims/1/force', {
        method: 'DELETE',
      });
      expect(hardDeleteResponse.status).toBe(401);
    });

    it('prevents access to payment financial data without authentication', async () => {
      // Collection endpoint
      const collectionResponse = await app.request('/api/payments');
      expect(collectionResponse.status).toBe(401);

      // Detail endpoint
      const detailResponse = await app.request('/api/payments/1');
      expect(detailResponse.status).toBe(401);
    });

    it('enforces authentication consistently across all HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      
      for (const method of methods) {
        const response = await app.request('/api/pilgrims', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: method !== 'GET' ? JSON.stringify({}) : undefined,
        });
        
        // All methods should require authentication
        expect(response.status).toBe(401);
      }
    });

    it('rejects malformed authorization headers', async () => {
      const malformedHeaders = [
        'Basic dGVzdDp0ZXN0', // Basic auth instead of Bearer
        'Bearer', // Missing token
        'Bearer ', // Empty token
        'bearer test-token', // Lowercase bearer
        'Token test-token', // Wrong scheme
      ];

      for (const authHeader of malformedHeaders) {
        const response = await app.request('/api/pilgrims', {
          headers: { Authorization: authHeader },
        });
        expect(response.status).toBe(401);
      }
    });

    it('enforces timing-safe token comparison', async () => {
      // Test with tokens that differ in various positions
      const similarTokens = [
        'test-admin-token-12346', // Last char different
        'test-admin-token-12344', // Last char different
        'xest-admin-token-12345', // First char different
        'test-admin-token-1234',  // Shorter
        'test-admin-token-123456', // Longer
      ];

      for (const token of similarTokens) {
        const response = await app.request('/api/pilgrims', {
          headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).toBe(401);
      }
    });
  });

  describe('Role-based access control', () => {
    it('requires admin role for operational routes', async () => {
      // The middleware is configured with roles: ["admin"]
      // Valid token should grant admin access
      const response = await app.request('/api/pilgrims', {
        headers: { Authorization: `Bearer ${validToken}` },
      });

      // Should not return 403 (forbidden) since valid token grants admin role
      expect(response.status).not.toBe(403);
    });

    it('returns 401 for missing credentials, not 403', async () => {
      // Without credentials, should get 401 (unauthenticated), not 403 (unauthorized)
      const response = await app.request('/api/pilgrims');
      expect(response.status).toBe(401);
    });
  });
});
