import { describe, expect, it } from 'vitest';
import app from '../index.js';

describe('Hono route baseline', () => {
  it('serves API metadata without a database connection', async () => {
    const response = await app.request('/');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      version: '1.0.0',
    });
    expect(body.endpoints.bookings).toBe('/api/bookings');
  });

  it('returns a structured 404', async () => {
    const response = await app.request('/missing');
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toMatchObject({
      success: false,
      error: 'Not Found',
    });
  });
});
