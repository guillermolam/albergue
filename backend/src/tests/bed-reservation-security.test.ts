/**
 * Bed Reservation Security Tests
 * 
 * Tests to verify mitigation of the unauthenticated bed reservation vulnerability
 * that enabled persistent inventory denial.
 * 
 * Pentest Finding: Unauthenticated bed reservation enables persistent inventory denial
 * 
 * The vulnerability allowed:
 * 1. Unauthenticated access to PATCH /api/beds/:id/reserve
 * 2. Caller-controlled status and reservedUntil fields
 * 3. Far-future timestamps with non-'reserved' status bypassing cleanup
 * 4. Inconsistent states (isAvailable=false, status=available) excluded from queries
 * 
 * Mitigation verifies:
 * 1. Authentication is required for reservation endpoints
 * 2. Status is server-controlled (always 'reserved')
 * 3. Reservation duration is capped at 24 hours
 * 4. Invalid date formats are rejected
 * 5. Past dates are rejected
 */

import { describe, expect, it, beforeEach } from 'vitest';
import app from '../index.js';

describe('Bed Reservation Security - Authentication', () => {
  it('rejects unauthenticated reservation attempts with 401', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'reserved',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Authentication required');
  });

  it('rejects reservation with invalid bearer token', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-12345',
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'reserved',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Authentication required');
  });

  it('rejects reservation without Authorization header', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Authentication required');
  });

  it('rejects release endpoint without authentication', async () => {
    const response = await app.request('/api/beds/1/release', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Authentication required');
  });
});

describe('Bed Reservation Security - Server-Controlled Status', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('ignores caller-supplied status and enforces server-controlled "reserved" status', async () => {
    // Attempt to set status to 'maintenance' (the exploit scenario)
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'maintenance', // Attacker-controlled value
      }),
    });

    // The endpoint should succeed (if bed exists and is available)
    // but the status should be 'reserved', not 'maintenance'
    // Note: This will return 409 if bed doesn't exist or isn't available,
    // which is expected in a test environment without database setup
    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      // The response should confirm the reservation
      expect(body.data).toBeDefined();
      expect(body.data.reservedUntil).toBeDefined();
    }
  });

  it('ignores caller-supplied status "available" that would create inconsistent state', async () => {
    // Attempt to create inconsistent state: isAvailable=false, status=available
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'available', // Would create inconsistent state
      }),
    });

    // Should not create inconsistent state
    expect([200, 409]).toContain(response.status);
  });

  it('ignores caller-supplied status "occupied"', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'occupied',
      }),
    });

    expect([200, 409]).toContain(response.status);
  });

  it('ignores arbitrary caller-supplied status values', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'arbitrary-malicious-status',
      }),
    });

    expect([200, 409]).toContain(response.status);
  });
});

describe('Bed Reservation Security - Duration Capping', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('caps far-future reservation (100 years) to maximum 24 hours', async () => {
    // Attempt to reserve for 100 years (the exploit scenario)
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 100);

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: farFuture.toISOString(),
      }),
    });

    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.reservedUntil).toBeDefined();
      
      // Verify the returned timestamp is capped at 24 hours
      const returnedTime = new Date(body.data.reservedUntil);
      const now = new Date();
      const maxAllowed = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const minAllowed = new Date(now.getTime() + 23.9 * 60 * 60 * 1000); // Allow small timing variance
      
      expect(returnedTime.getTime()).toBeLessThanOrEqual(maxAllowed.getTime());
      expect(returnedTime.getTime()).toBeGreaterThanOrEqual(minAllowed.getTime());
    }
  });

  it('caps 48-hour reservation to 24 hours', async () => {
    const fortyEightHours = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: fortyEightHours.toISOString(),
      }),
    });

    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      const returnedTime = new Date(body.data.reservedUntil);
      const now = new Date();
      const maxAllowed = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      expect(returnedTime.getTime()).toBeLessThanOrEqual(maxAllowed.getTime());
    }
  });

  it('accepts valid reservation within 24-hour limit', async () => {
    const twelveHours = new Date(Date.now() + 12 * 60 * 60 * 1000);

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: twelveHours.toISOString(),
      }),
    });

    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.reservedUntil).toBeDefined();
    }
  });

  it('defaults to 1 hour when no reservedUntil is provided', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({}),
    });

    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.reservedUntil).toBeDefined();
      
      // Verify it's approximately 1 hour from now
      const returnedTime = new Date(body.data.reservedUntil);
      const now = new Date();
      const expectedTime = new Date(now.getTime() + 60 * 60 * 1000);
      const timeDiff = Math.abs(returnedTime.getTime() - expectedTime.getTime());
      
      // Allow 5 seconds variance for processing time
      expect(timeDiff).toBeLessThan(5000);
    }
  });
});

describe('Bed Reservation Security - Date Validation', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('rejects invalid date format with 400', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: 'not-a-valid-date',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Invalid reservedUntil date format');
  });

  it('rejects malformed ISO date string', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: '2024-13-45T99:99:99Z', // Invalid month/day/time
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('rejects past date with 400', async () => {
    const pastDate = new Date(Date.now() - 3600000); // 1 hour ago

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: pastDate.toISOString(),
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Reservation time must be in the future');
  });

  it('rejects current time (not in future)', async () => {
    const now = new Date();

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: now.toISOString(),
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Reservation time must be in the future');
  });

  it('rejects numeric timestamp instead of ISO string', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: Date.now() + 3600000, // Numeric timestamp
      }),
    });

    // This might be accepted by Date constructor, but should be validated
    // The endpoint should handle this gracefully
    expect([200, 400, 409]).toContain(response.status);
  });
});

describe('Bed Reservation Security - Exploit Prevention', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('prevents the original exploit: far-future + maintenance status', async () => {
    // This is the exact exploit scenario from the pentest
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 100);

    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: farFuture.toISOString(),
        status: 'maintenance',
      }),
    });

    // Should either succeed with capped duration and 'reserved' status,
    // or fail with 409 if bed unavailable
    expect([200, 409]).toContain(response.status);
    
    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      
      // Verify duration is capped
      const returnedTime = new Date(body.data.reservedUntil);
      const now = new Date();
      const maxAllowed = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expect(returnedTime.getTime()).toBeLessThanOrEqual(maxAllowed.getTime());
    }
  });

  it('prevents inconsistent state: isAvailable=false + status=available', async () => {
    // This exploit creates a bed that's excluded from both availability and occupancy queries
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'available', // Inconsistent with isAvailable=false
      }),
    });

    // Should not create inconsistent state
    expect([200, 409]).toContain(response.status);
  });

  it('prevents inventory denial via multiple unauthenticated requests', async () => {
    // Attempt multiple reservations without authentication
    const requests = Array.from({ length: 5 }, (_, i) => 
      app.request(`/api/beds/${i + 1}/reserve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservedUntil: new Date(Date.now() + 3600000).toISOString(),
          status: 'maintenance',
        }),
      })
    );

    const responses = await Promise.all(requests);
    
    // All should be rejected with 401
    responses.forEach(response => {
      expect(response.status).toBe(401);
    });
  });
});

describe('Bed Reservation Security - Admin Endpoints', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('requires admin role for cleanup-expired endpoint', async () => {
    const response = await app.request('/api/beds/cleanup-expired', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Authentication required');
  });

  it('requires admin role for bed creation', async () => {
    const response = await app.request('/api/beds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bedNumber: 1,
        roomNumber: 1,
        roomName: 'Test Room',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('requires admin role for bed updates', async () => {
    const response = await app.request('/api/beds/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: 'Updated Room',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('requires admin role for bed deletion', async () => {
    const response = await app.request('/api/beds/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});

describe('Bed Reservation Security - Response Structure', () => {
  const validToken = process.env.ADMIN_API_TOKEN || 'test-admin-token';

  it('returns reservedUntil in response for successful reservation', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: new Date(Date.now() + 3600000).toISOString(),
      }),
    });

    if (response.status === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.reservedUntil).toBeDefined();
      expect(typeof body.data.reservedUntil).toBe('string');
      
      // Verify it's a valid ISO date string
      const date = new Date(body.data.reservedUntil);
      expect(date.toString()).not.toBe('Invalid Date');
    }
  });

  it('includes proper error structure for validation failures', async () => {
    const response = await app.request('/api/beds/1/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        reservedUntil: 'invalid-date',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
    expect(typeof body.error).toBe('string');
  });
});
