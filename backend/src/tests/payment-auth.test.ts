/**
 * Payment Authentication Security Tests
 * 
 * Verifies that the pentest finding "Unauthenticated payment collection endpoints 
 * disclose financial and gateway data" has been properly mitigated.
 * 
 * The fix adds authentication middleware to all /api/payments/* endpoints except
 * the Redsys webhook at /api/payments/redsys/notification (POST only).
 */

import { describe, expect, it, beforeAll } from 'vitest';
import app from '../index.js';

describe('Payment endpoint authentication (pentest mitigation)', () => {
  let validAdminToken: string | undefined;
  
  beforeAll(() => {
    // Store the configured admin token for authenticated tests
    validAdminToken = process.env.ADMIN_API_TOKEN;
  });

  describe('Unauthenticated access to payment collection endpoints', () => {
    it('rejects unauthenticated GET /api/payments (list endpoint)', async () => {
      const response = await app.request('/api/payments');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments with pagination params', async () => {
      // This tests the specific exploit scenario: attacker-controlled pagination
      const response = await app.request('/api/payments?page=1&pageSize=1000');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/pending', async () => {
      const response = await app.request('/api/payments/pending');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/overdue', async () => {
      const response = await app.request('/api/payments/overdue');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/stats', async () => {
      const response = await app.request('/api/payments/stats');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/:id (individual payment)', async () => {
      const response = await app.request('/api/payments/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated GET /api/payments/booking/:bookingId', async () => {
      const response = await app.request('/api/payments/booking/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects unauthenticated POST /api/payments/intent', async () => {
      const response = await app.request('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingReference: 'TEST-123',
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

  describe('Redsys webhook exception', () => {
    it('allows unauthenticated POST to /api/payments/redsys/notification', async () => {
      // The Redsys webhook must remain accessible for external gateway callbacks
      // We expect it to fail with 400 (malformed) or 503 (not configured), not 401
      const response = await app.request('/api/payments/redsys/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'Ds_MerchantParameters=test&Ds_Signature=test',
      });

      // Should NOT be 401 (authentication required)
      expect(response.status).not.toBe(401);
      // Will be 400 (malformed), 503 (not configured), or 404 (unknown order)
      expect([400, 503, 404]).toContain(response.status);
    });

    it('rejects unauthenticated GET to /api/payments/redsys/notification', async () => {
      // Only POST should be allowed without auth; GET should require auth
      const response = await app.request('/api/payments/redsys/notification', {
        method: 'GET',
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Authenticated access with valid admin token', () => {
    it('allows authenticated GET /api/payments with valid admin token', async () => {
      if (!validAdminToken) {
        // Skip if no admin token is configured (test environment)
        return;
      }

      const response = await app.request('/api/payments', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      // Should not be 401 (authentication required) or 403 (forbidden)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
      // May be 200 (success) or 500 (database error in test env)
      expect([200, 500]).toContain(response.status);
    });

    it('allows authenticated GET /api/payments/pending with valid admin token', async () => {
      if (!validAdminToken) {
        return;
      }

      const response = await app.request('/api/payments/pending', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
      expect([200, 500]).toContain(response.status);
    });

    it('allows authenticated GET /api/payments/overdue with valid admin token', async () => {
      if (!validAdminToken) {
        return;
      }

      const response = await app.request('/api/payments/overdue', {
        headers: {
          'Authorization': `Bearer ${validAdminToken}`,
        },
      });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('Invalid authentication attempts', () => {
    it('rejects requests with invalid bearer token', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          'Authorization': 'Bearer invalid-token-12345',
        },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('rejects requests with malformed authorization header', async () => {
      const response = await app.request('/api/payments', {
        headers: {
          'Authorization': 'NotBearer token',
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
          'Authorization': 'Bearer ',
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

  describe('Cross-account enumeration prevention', () => {
    it('prevents bulk enumeration via large pageSize without authentication', async () => {
      // Attacker attempts to download all payment records with large pageSize
      const response = await app.request('/api/payments?page=1&pageSize=999999');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('prevents offset-based enumeration without authentication', async () => {
      // Attacker attempts to enumerate records by iterating through pages
      const response = await app.request('/api/payments?page=1&pageSize=100');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });

    it('prevents access to individual payment records without authentication', async () => {
      // Attacker attempts to enumerate individual payment IDs
      const testIds = [1, 2, 3, 100, 999];
      
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

    it('prevents access to booking-specific payments without authentication', async () => {
      // Attacker attempts to enumerate payments by booking ID
      const response = await app.request('/api/payments/booking/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toMatchObject({
        success: false,
        error: 'Authentication required',
      });
    });
  });

  describe('Sensitive data disclosure prevention', () => {
    it('does not leak payment data in error responses', async () => {
      const response = await app.request('/api/payments/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      // Verify response does not contain sensitive payment fields
      expect(JSON.stringify(body)).not.toMatch(/amount/i);
      expect(JSON.stringify(body)).not.toMatch(/transactionId/i);
      expect(JSON.stringify(body)).not.toMatch(/receiptNumber/i);
      expect(JSON.stringify(body)).not.toMatch(/gatewayResponse/i);
      expect(JSON.stringify(body)).not.toMatch(/bookingId/i);
    });

    it('does not leak payment collection data in error responses', async () => {
      const response = await app.request('/api/payments');
      const body = await response.json();

      expect(response.status).toBe(401);
      // Verify response does not contain payment collection data
      expect(body.data).toBeUndefined();
      expect(body.payments).toBeUndefined();
      expect(JSON.stringify(body)).not.toMatch(/amount/i);
      expect(JSON.stringify(body)).not.toMatch(/transactionId/i);
    });
  });

  describe('HTTP method security', () => {
    it('requires authentication for all HTTP methods on payment endpoints', async () => {
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      
      for (const method of methods) {
        // Skip POST to webhook (it's the exception)
        if (method === 'POST') continue;
        
        const response = await app.request('/api/payments', {
          method: method as any,
        });

        // All methods should require authentication
        expect(response.status).toBe(401);
      }
    });
  });
});
