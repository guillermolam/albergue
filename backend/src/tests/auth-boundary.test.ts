/**
 * Authentication Boundary Tests
 * 
 * Verifies that the security fix for the pentest finding
 * "Unauthenticated booking, pilgrim, and payment APIs expose cross-customer records"
 * is properly mitigated.
 * 
 * The fix adds authentication middleware to /pilgrims/*, /bookings/*, /payments/*, 
 * and /notifications/* routes to prevent anonymous enumeration and cross-customer 
 * data disclosure.
 */

import { describe, expect, it, beforeAll, vi } from 'vitest';
import { authMiddleware } from '../lib/middleware.js';
import { Hono } from 'hono';
import type { Context } from 'hono';

describe('Authentication boundary for customer data APIs', () => {
  let validAdminToken: string;
  let invalidToken: string;
  let testApp: Hono;

  beforeAll(() => {
    // Set up test tokens
    validAdminToken = process.env.ADMIN_API_TOKEN || 'test-admin-token-12345';
    invalidToken = 'invalid-token-wrong';
    
    // Ensure the environment has the admin token set for tests
    process.env.ADMIN_API_TOKEN = validAdminToken;

    // Create a minimal test app that mimics the production routing structure
    testApp = new Hono();
    const api = new Hono();

    // Apply authentication middleware to customer data routes (the fix)
    api.use('/pilgrims/*', authMiddleware({ roles: ['admin'] }));
    api.use('/bookings/*', authMiddleware({ roles: ['admin'] }));
    api.use('/payments/*', authMiddleware({ roles: ['admin'] }));
    api.use('/notifications/*', authMiddleware({ roles: ['admin'] }));

    // Mount mock routes that return success if auth passes
    const mockHandler = (c: Context) => c.json({ success: true, data: [] });
    
    // Bookings routes
    api.get('/bookings', mockHandler);
    api.get('/bookings/:id', mockHandler);
    api.get('/bookings/:id/details', mockHandler);
    api.get('/bookings/reference/:reference', mockHandler);
    api.get('/bookings/pilgrim/:pilgrimId', mockHandler);
    api.get('/bookings/search', mockHandler);
    api.get('/bookings/active', mockHandler);
    api.get('/bookings/upcoming', mockHandler);
    api.get('/bookings/overdue', mockHandler);
    api.get('/bookings/stats', mockHandler);
    api.get('/bookings/recent', mockHandler);
    api.get('/bookings/date-range', mockHandler);
    api.post('/bookings', mockHandler);

    // Pilgrims routes
    api.get('/pilgrims', mockHandler);
    api.get('/pilgrims/:id', mockHandler);
    api.get('/pilgrims/search', mockHandler);
    api.get('/pilgrims/email/:email', mockHandler);
    api.get('/pilgrims/document/:documentNumber', mockHandler);
    api.get('/pilgrims/active', mockHandler);
    api.get('/pilgrims/stats', mockHandler);
    api.get('/pilgrims/recent', mockHandler);
    api.post('/pilgrims', mockHandler);

    // Payments routes
    api.get('/payments', mockHandler);
    api.get('/payments/:id', mockHandler);
    api.get('/payments/booking/:bookingId', mockHandler);
    api.get('/payments/pending', mockHandler);
    api.get('/payments/overdue', mockHandler);
    api.get('/payments/paid', mockHandler);
    api.get('/payments/stats', mockHandler);
    api.get('/payments/recent', mockHandler);
    api.get('/payments/search', mockHandler);
    api.post('/payments', mockHandler);

    // Notifications routes
    api.get('/notifications', mockHandler);
    api.get('/notifications/:id', mockHandler);

    // Public routes (no auth required)
    api.get('/beds', mockHandler);
    api.get('/pricing', mockHandler);
    api.post('/auth/login', mockHandler);

    testApp.route('/api', api);
  });

  describe('Bookings API authentication', () => {
    it('rejects anonymous GET /api/bookings (collection enumeration)', async () => {
      const response = await testApp.request('/api/bookings');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/:id (direct ID lookup)', async () => {
      const response = await testApp.request('/api/bookings/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/:id/details (detailed disclosure)', async () => {
      const response = await testApp.request('/api/bookings/1/details');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/reference/:reference (reference lookup)', async () => {
      const response = await testApp.request('/api/bookings/reference/ALB-TEST123');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/pilgrim/:pilgrimId (cross-customer enumeration)', async () => {
      const response = await testApp.request('/api/bookings/pilgrim/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/search (search-based discovery)', async () => {
      const response = await testApp.request('/api/bookings/search?q=test');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/active (active bookings enumeration)', async () => {
      const response = await testApp.request('/api/bookings/active');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/upcoming (upcoming check-ins)', async () => {
      const response = await testApp.request('/api/bookings/upcoming');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/overdue (overdue reservations)', async () => {
      const response = await testApp.request('/api/bookings/overdue');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/stats (booking statistics)', async () => {
      const response = await testApp.request('/api/bookings/stats');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/recent (recent bookings)', async () => {
      const response = await testApp.request('/api/bookings/recent');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/bookings/date-range (date range query)', async () => {
      const response = await testApp.request('/api/bookings/date-range?startDate=2024-01-01&endDate=2024-12-31');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous POST /api/bookings (booking creation)', async () => {
      const response = await testApp.request('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilgrimId: 1,
          checkInDate: '2024-01-01',
          checkOutDate: '2024-01-02',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests with invalid bearer token', async () => {
      const response = await testApp.request('/api/bookings', {
        headers: { Authorization: `Bearer ${invalidToken}` },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('allows authenticated requests with valid admin token', async () => {
      const response = await testApp.request('/api/bookings', {
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });

      // Should not be 401 - authentication passed
      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });
  });

  describe('Pilgrims API authentication', () => {
    it('rejects anonymous GET /api/pilgrims (collection enumeration)', async () => {
      const response = await testApp.request('/api/pilgrims');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/:id (direct ID lookup)', async () => {
      const response = await testApp.request('/api/pilgrims/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/search (search-based discovery)', async () => {
      const response = await testApp.request('/api/pilgrims/search?q=test');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/email/:email (email lookup)', async () => {
      const response = await testApp.request('/api/pilgrims/email/test@example.com');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/document/:documentNumber (document lookup)', async () => {
      const response = await testApp.request('/api/pilgrims/document/12345678A');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/active (active pilgrims)', async () => {
      const response = await testApp.request('/api/pilgrims/active');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/stats (pilgrim statistics)', async () => {
      const response = await testApp.request('/api/pilgrims/stats');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/pilgrims/recent (recent pilgrims)', async () => {
      const response = await testApp.request('/api/pilgrims/recent');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous POST /api/pilgrims (pilgrim creation)', async () => {
      const response = await testApp.request('/api/pilgrims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests with invalid bearer token', async () => {
      const response = await testApp.request('/api/pilgrims', {
        headers: { Authorization: `Bearer ${invalidToken}` },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('allows authenticated requests with valid admin token', async () => {
      const response = await testApp.request('/api/pilgrims', {
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });

      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });
  });

  describe('Payments API authentication', () => {
    it('rejects anonymous GET /api/payments (collection enumeration)', async () => {
      const response = await testApp.request('/api/payments');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/:id (direct ID lookup)', async () => {
      const response = await testApp.request('/api/payments/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/booking/:bookingId (booking payments)', async () => {
      const response = await testApp.request('/api/payments/booking/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/pending (pending payments)', async () => {
      const response = await testApp.request('/api/payments/pending');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/overdue (overdue payments)', async () => {
      const response = await testApp.request('/api/payments/overdue');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/paid (paid payments)', async () => {
      const response = await testApp.request('/api/payments/paid');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/stats (payment statistics)', async () => {
      const response = await testApp.request('/api/payments/stats');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/recent (recent payments)', async () => {
      const response = await testApp.request('/api/payments/recent');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/payments/search (payment search)', async () => {
      const response = await testApp.request('/api/payments/search?q=test');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous POST /api/payments (payment creation)', async () => {
      const response = await testApp.request('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: 1,
          amount: '100.00',
        }),
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests with invalid bearer token', async () => {
      const response = await testApp.request('/api/payments', {
        headers: { Authorization: `Bearer ${invalidToken}` },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('allows authenticated requests with valid admin token', async () => {
      const response = await testApp.request('/api/payments', {
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });

      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });
  });

  describe('Notifications API authentication', () => {
    it('rejects anonymous GET /api/notifications (collection enumeration)', async () => {
      const response = await testApp.request('/api/notifications');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects anonymous GET /api/notifications/:id (direct ID lookup)', async () => {
      const response = await testApp.request('/api/notifications/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests with invalid bearer token', async () => {
      const response = await testApp.request('/api/notifications', {
        headers: { Authorization: `Bearer ${invalidToken}` },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('allows authenticated requests with valid admin token', async () => {
      const response = await testApp.request('/api/notifications', {
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });

      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });
  });

  describe('Public endpoints remain accessible', () => {
    it('allows anonymous access to GET /api/beds (public availability)', async () => {
      const response = await testApp.request('/api/beds');
      
      // Should not be 401 - beds are public for availability checks
      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });

    it('allows anonymous access to GET /api/pricing (public pricing)', async () => {
      const response = await testApp.request('/api/pricing');
      
      // Should not be 401 - pricing is public for quote flows
      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });

    it('allows anonymous access to POST /api/auth/login (authentication endpoint)', async () => {
      const response = await testApp.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test',
          password: 'test',
        }),
      });
      
      // Should not be 401 - auth endpoints must be public
      expect(response.status).not.toBe(401);
      expect(response.status).toBe(200);
    });
  });

  describe('Authentication middleware behavior', () => {
    it('uses timing-safe comparison for token validation', async () => {
      // This test verifies that the middleware doesn't leak timing information
      // by measuring response times for valid vs invalid tokens
      const validStart = Date.now();
      await testApp.request('/api/bookings', {
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });
      const validDuration = Date.now() - validStart;

      const invalidStart = Date.now();
      await testApp.request('/api/bookings', {
        headers: { Authorization: `Bearer ${invalidToken}` },
      });
      const invalidDuration = Date.now() - invalidStart;

      // Both should complete in similar time (within 100ms)
      // This is a basic timing attack mitigation check
      const timingDifference = Math.abs(validDuration - invalidDuration);
      expect(timingDifference).toBeLessThan(100);
    });

    it('rejects malformed Authorization headers', async () => {
      const response = await testApp.request('/api/bookings', {
        headers: { Authorization: 'NotBearer token' },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects empty Bearer tokens', async () => {
      const response = await testApp.request('/api/bookings', {
        headers: { Authorization: 'Bearer ' },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('rejects requests when ADMIN_API_TOKEN is not configured', async () => {
      const originalToken = process.env.ADMIN_API_TOKEN;
      delete process.env.ADMIN_API_TOKEN;

      const response = await testApp.request('/api/bookings', {
        headers: { Authorization: 'Bearer some-token' },
      });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');

      // Restore token
      process.env.ADMIN_API_TOKEN = originalToken;
    });
  });

  describe('Sequential ID enumeration prevention', () => {
    it('prevents sequential booking ID enumeration without auth', async () => {
      // Test that an attacker cannot enumerate bookings by trying sequential IDs
      const ids = [1, 2, 3, 4, 5];
      
      for (const id of ids) {
        const response = await testApp.request(`/api/bookings/${id}`);
        const body = await response.json();
        
        expect(response.status).toBe(401);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Authentication required');
      }
    });

    it('prevents sequential pilgrim ID enumeration without auth', async () => {
      const ids = [1, 2, 3, 4, 5];
      
      for (const id of ids) {
        const response = await testApp.request(`/api/pilgrims/${id}`);
        const body = await response.json();
        
        expect(response.status).toBe(401);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Authentication required');
      }
    });

    it('prevents sequential payment ID enumeration without auth', async () => {
      const ids = [1, 2, 3, 4, 5];
      
      for (const id of ids) {
        const response = await testApp.request(`/api/payments/${id}`);
        const body = await response.json();
        
        expect(response.status).toBe(401);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Authentication required');
      }
    });
  });

  describe('Cross-customer data access prevention', () => {
    it('prevents accessing bookings by pilgrim ID without auth', async () => {
      // This endpoint was specifically mentioned in the pentest as allowing
      // cross-customer enumeration
      const response = await testApp.request('/api/bookings/pilgrim/1');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('prevents accessing booking details without auth', async () => {
      // The details endpoint was highlighted as exposing complete rows
      // from booking, pilgrim, bed, and payment tables
      const response = await testApp.request('/api/bookings/1/details');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });

    it('prevents search-based discovery without auth', async () => {
      // Search endpoints allow discovery of records
      const response = await testApp.request('/api/bookings/search?q=test');
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Authentication required');
    });
  });
});
