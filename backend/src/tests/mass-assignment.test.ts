/**
 * Mass Assignment Guards
 *
 * createPilgrim/updatePilgrim/updateBed used to spread the entire request
 * body into the DB write, so a client could set server-controlled columns
 * (dataRetentionUntil, consentDate, id, ...) directly. These pure sanitizer
 * functions are the fix; tested in isolation since exercising the full
 * command would require a live database.
 */
import { describe, expect, it } from 'vitest';
import { pickWritableFields } from '../commands/pilgrims.js';
import { pickWritableBedFields } from '../commands/beds.js';

describe('pickWritableFields (pilgrims)', () => {
  it('keeps legitimate fields and drops server-controlled ones', () => {
    const malicious = {
      firstName: 'Ana',
      lastName1: 'García',
      consentGiven: true,
      // server-controlled — must never come from the client
      consentDate: new Date('2020-01-01'),
      dataRetentionUntil: new Date('2099-01-01'),
      lastAccessDate: new Date('2020-01-01'),
    } as never;

    const sanitized = pickWritableFields(malicious);

    expect(sanitized.firstName).toBe('Ana');
    expect(sanitized.lastName1).toBe('García');
    expect(sanitized.consentGiven).toBe(true);
    expect('consentDate' in sanitized).toBe(false);
    expect('dataRetentionUntil' in sanitized).toBe(false);
    expect('lastAccessDate' in sanitized).toBe(false);
  });

  it('drops keys entirely absent from the writable allowlist', () => {
    const malicious = {
      firstName: 'Ana',
      id: 999999,
      createdAt: new Date('1999-01-01'),
    } as never;

    const sanitized = pickWritableFields(malicious);

    expect('id' in sanitized).toBe(false);
    expect('createdAt' in sanitized).toBe(false);
  });
});

describe('pickWritableBedFields', () => {
  it('keeps legitimate fields and drops id/createdAt/updatedAt', () => {
    const malicious = {
      status: 'maintenance',
      pricePerNight: '99.00',
      id: 1,
      createdAt: new Date('1999-01-01'),
      updatedAt: new Date('1999-01-01'),
    } as unknown as Parameters<typeof pickWritableBedFields>[0];

    const sanitized = pickWritableBedFields(malicious);

    expect(sanitized.status).toBe('maintenance');
    expect(sanitized.pricePerNight).toBe('99.00');
    expect('id' in sanitized).toBe(false);
    expect('createdAt' in sanitized).toBe(false);
    expect('updatedAt' in sanitized).toBe(false);
  });

  it('omits undefined fields rather than passing them through', () => {
    const sanitized = pickWritableBedFields({ status: undefined, isAvailable: false });
    expect('status' in sanitized).toBe(false);
    expect(sanitized.isAvailable).toBe(false);
  });
});
