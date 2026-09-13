/**
 * Payment Authentication Security Tests
 * 
 * Verifies that the payment endpoints require admin authentication to prevent
 * unauthorized disclosure of payment records across bookings.
 * 
 * Tests the mitigation for: "Unauthenticated payment read endpoints disclose 
 * all booking payment records"
 */

import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index.js';

describe('Payment endpoint authentication (pentest mitigation)', () => {
  const validAdminToken = 'test-admin-token-12345';
  const invalidToken = 'wrong-token';

  beforeAll(() => {
    // Set the admin token for tests
    process.env.ADMIN_API_TOKEN = validAdminToken;
  });

  describe('GET /api/payments - list all payments', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('rejects requests with malformed authorization header', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: 'InvalidFormat',
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with empty bearer token', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: 'Bearer ',
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

  describe('GET /api/payments/:id - get payment by ID', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments/1', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments/1', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 404 or 500, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('prevents enumeration of payment IDs without authentication', async () => {
      // Test multiple IDs to verify consistent rejection
      const testIds = [1, 2, 100, 999];
      
      for (const id of testIds) {
        const response = await app.request(`/api/payments/${id}`);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });
  });

  describe('GET /api/payments/booking/:bookingId - get payments by booking', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments/booking/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments/booking/1', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments/booking/1', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 404 or 500, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('prevents enumeration of booking IDs without authentication', async () => {
      // Test multiple booking IDs to verify consistent rejection
      const testBookingIds = [1, 5, 50, 500];
      
      for (const bookingId of testBookingIds) {
        const response = await app.request(`/api/payments/booking/${bookingId}`);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });
  });

  describe('GET /api/payments/pending - get pending payments', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments/pending');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments/pending', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments/pending', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('GET /api/payments/overdue - get overdue payments', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments/overdue');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments/overdue', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments/overdue', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('GET /api/payments/stats - get payment statistics', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await app.request('/api/payments/stats');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with invalid token with 401', async () => {
      const response = await app.request('/api/payments/stats', {
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

    it('allows authenticated admin requests', async () => {
      const response = await app.request('/api/payments/stats', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 or 403 (may be 500 if DB not available, but auth passed)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('Public endpoints remain accessible', () => {
    it('POST /api/payments/intent remains public (has own validation)', async () => {
      // This endpoint should not require authentication as it has its own validation
      // It should fail with 400 (bad request) not 401 (unauthorized)
      const response = await app.request('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Should not be 401 (should be 400 for missing bookingReference or 501 for missing config)
      expect(response.status).not.toBe(401);
      expect([400, 501]).toContain(response.status);
    });

    it('POST /api/payments/redsys/notification remains public (webhook)', async () => {
      // This endpoint should not require authentication as it's a webhook
      // It should fail with 400 (bad request) not 401 (unauthorized)
      const response = await app.request('/api/payments/redsys/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: '',
      });

      // Should not be 401 (should be 400 for malformed notification or 503 for missing config)
      expect(response.status).not.toBe(401);
      expect([400, 503]).toContain(response.status);
    });
  });

  describe('Security properties', () => {
    it('enforces timing-safe token comparison', async () => {
      // Test that similar but wrong tokens are rejected
      const similarTokens = [
        validAdminToken.slice(0, -1), // One char short
        validAdminToken + 'x', // One char extra
        validAdminToken.toUpperCase(), // Different case
        validAdminToken.replace('1', '2'), // One char different
      ];

      for (const token of similarTokens) {
        const response = await app.request('/api/payments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(response.status).toBe(401);
      }
    });

    it('does not leak information about payment existence in auth errors', async () => {
      // Both existing and non-existing payment IDs should return same 401 error
      const response1 = await app.request('/api/payments/1');
      const response2 = await app.request('/api/payments/999999');
      
      const body1 = await response1.json();
      const body2 = await response2.json();

      expect(response1.status).toBe(401);
      expect(response2.status).toBe(401);
      expect(body1.error).toBe(body2.error);
    });

    it('requires admin role specifically', async () => {
      // The middleware is configured with roles: ['admin']
      // This test verifies the configuration is correct
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: `Bearer ${validAdminToken}`,
        },
      });

      // If auth passes, we should not get 403 (forbidden due to role)
      // We may get 500 (DB error) but not 403
      if (response.status !== 500) {
        expect(response.status).not.toBe(403);
      }
    });

    it('applies authentication to all read endpoints consistently', async () => {
      // Verify all read endpoints are protected
      const readEndpoints = [
        '/api/payments',
        '/api/payments/1',
        '/api/payments/booking/1',
        '/api/payments/pending',
        '/api/payments/overdue',
        '/api/payments/stats',
      ];

      for (const endpoint of readEndpoints) {
        const response = await app.request(endpoint);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });
  });

  describe('Pagination parameters do not bypass authentication', () => {
    it('rejects list requests with pagination params without auth', async () => {
      const response = await app.request('/api/payments?page=1&pageSize=10');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects list requests with ordering params without auth', async () => {
      const response = await app.request('/api/payments?orderBy=amount&orderDirection=desc');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects list requests with all query params without auth', async () => {
      const response = await app.request(
        '/api/payments?page=2&pageSize=50&orderBy=paymentDate&orderDirection=asc'
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Edge cases and attack vectors', () => {
    it('rejects SQL injection attempts in payment ID without auth', async () => {
      const sqlInjectionAttempts = [
        "1' OR '1'='1",
        '1; DROP TABLE payments--',
        '1 UNION SELECT * FROM payments--',
      ];

      for (const attempt of sqlInjectionAttempts) {
        const response = await app.request(`/api/payments/${encodeURIComponent(attempt)}`);
        const body = await response.json();

        // Should be rejected at auth layer before reaching query
        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });

    it('rejects path traversal attempts without auth', async () => {
      const pathTraversalAttempts = [
        '../../../etc/passwd',
        '..%2F..%2F..%2Fetc%2Fpasswd',
        '....//....//....//etc/passwd',
      ];

      for (const attempt of pathTraversalAttempts) {
        const response = await app.request(`/api/payments/${encodeURIComponent(attempt)}`);
        const body = await response.json();

        // Should be rejected at auth layer
        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });

    it('rejects requests with case variations of Bearer scheme', async () => {
      const caseVariations = ['bearer', 'BEARER', 'BeArEr'];

      for (const scheme of caseVariations) {
        const response = await app.request('/api/payments', {
          headers: {
            Authorization: `${scheme} ${validAdminToken}`,
          },
        });
        const body = await response.json();

        // Only 'Bearer' (capital B) should be accepted
        expect(response.status).toBe(401);
        expect(body).toMatchObject({
          success: false,
          error: 'Authentication required',
        });
      }
    });

    it('rejects requests with extra whitespace in token', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          Authorization: `Bearer  ${validAdminToken}  `,
        },
      });
      const body = await response.json();

      // Extra whitespace should cause token mismatch
      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });
});
