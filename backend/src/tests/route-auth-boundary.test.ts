/**
 * Route Auth Boundary
 *
 * Verifies the corrected per-method admin gating: previously-unauthenticated
 * admin data (pilgrim/booking/payment lists, reads, mutations) now requires
 * a bearer token, while the guest booking flow (create pilgrim, create
 * booking, get a quote, check availability, look up a confirmation, create
 * a payment intent) stays reachable without one.
 *
 * No live database is available in this test environment, so requests that
 * pass the auth boundary and reach a query/command are expected to fail
 * further down the stack (500/503) — what matters here is that they are
 * never rejected at the auth boundary (401/403).
 */
import { describe, expect, it } from 'vitest';
import app from '../index.js';

async function status(path: string, init?: RequestInit): Promise<number> {
  const res = await app.request(path, init);
  return res.status;
}

describe('admin-gated endpoints reject unauthenticated requests', () => {
  it.each([
    ['GET', '/api/pilgrims'],
    ['GET', '/api/pilgrims/1'],
    ['GET', '/api/pilgrims/search?q=x'],
    ['PUT', '/api/pilgrims/1'],
    ['DELETE', '/api/pilgrims/1'],
    ['GET', '/api/bookings'],
    ['GET', '/api/bookings/1'],
    ['GET', '/api/bookings/stats'],
    ['GET', '/api/payments'],
    ['GET', '/api/payments/pending'],
    ['GET', '/api/notifications'],
    ['GET', '/api/pricing'],
  ])('%s %s -> 401', async (method, path) => {
    expect(await status(path, { method })).toBe(401);
  });
});

describe('guest booking flow stays public', () => {
  it.each([
    ['POST', '/api/pilgrims'],
    ['POST', '/api/bookings'],
    ['POST', '/api/bookings/quote'],
    ['GET', '/api/bookings/available-beds?checkInDate=2026-01-01&checkOutDate=2026-01-02'],
    ['GET', '/api/bookings/reference/ALB-000000000000'],
    ['POST', '/api/payments/intent'],
  ])('%s %s does not require auth', async (method, path) => {
    const responseStatus = await status(path, {
      method,
      headers: method === 'POST' ? { 'content-type': 'application/json' } : undefined,
      body: method === 'POST' ? '{}' : undefined,
    });
    expect(responseStatus).not.toBe(401);
    expect(responseStatus).not.toBe(403);
  });
});

describe('static routes are not shadowed by a same-method /:id route', () => {
  it('GET /api/bookings/available-beds reaches its own handler, not GET /:id', async () => {
    // Regression check: /:id is admin-gated and, before routes were
    // reordered, matched "available-beds" as its :id param — this request
    // would incorrectly 401 instead of reaching the public handler.
    const res = await app.request(
      '/api/bookings/available-beds?checkInDate=2026-01-01&checkOutDate=2026-01-02'
    );
    expect(res.status).not.toBe(401);
  });
});
