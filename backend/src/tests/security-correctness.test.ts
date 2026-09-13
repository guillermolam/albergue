import { describe, expect, it } from 'vitest';
import { createBookingsBatch } from '../commands/bookings.js';
import { bulkUpdateBookings } from '../commands/bookings.js';
import { bulkUpdateBeds } from '../commands/beds.js';
import { bulkDeleteUsers } from '../commands/users.js';
import { createPilgrim, updatePilgrim, createPilgrimsBatch, bulkUpdatePilgrims } from '../commands/pilgrims.js';
import app from '../index.js';

describe('Phase 1 security and correctness guards', () => {
  it('rejects duplicate bed claims before starting batch writes', async () => {
    await expect(
      createBookingsBatch([
        { bedAssignmentId: 7 } as never,
        { bedAssignmentId: 7 } as never,
      ])
    ).rejects.toThrow('more than one booking');
  });

  it('treats empty bulk ID sets as no-ops', async () => {
    await expect(bulkUpdateBookings([], {})).resolves.toBe(0);
    await expect(bulkUpdateBeds([], {})).resolves.toBe(0);
    await expect(bulkDeleteUsers([])).resolves.toBe(0);
  });

  it('hashes passwords with scrypt and verifies them timing-safe', async () => {
    const { hashPassword, verifyPassword, verifyPasswordOrDummy } = await import(
      '../lib/passwords.js'
    );

    const stored = await hashPassword('correct horse battery staple');
    expect(stored).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(stored).not.toContain('correct horse');

    await expect(verifyPassword('correct horse battery staple', stored)).resolves.toBe(true);
    await expect(verifyPassword('wrong', stored)).resolves.toBe(false);
    // Unknown-user path: same scrypt cost, always false
    await expect(verifyPasswordOrDummy('anything', null)).resolves.toBe(false);
  });

  it('prevents mass assignment of protected pilgrim fields during create', async () => {
    const maliciousInput = {
      firstName: 'John',
      lastName1: 'Doe',
      birthDate: '1990-01-01',
      documentType: 'passport',
      documentNumber: '123456',
      gender: 'M',
      phone: '+34600000000',
      addressCountry: 'ES',
      addressStreet: 'Test St',
      addressCity: 'Madrid',
      addressPostalCode: '28001',
      // Attempt to set server-controlled fields
      id: 99999,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      lastAccessDate: new Date('2020-01-01'),
      consentDate: new Date('2020-01-01'),
      dataRetentionUntil: new Date('2099-01-01'),
    } as any;

    const pilgrim = await createPilgrim(maliciousInput);
    
    // Server-controlled fields should not match the malicious input
    expect(pilgrim.id).not.toBe(99999);
    expect(pilgrim.createdAt?.getFullYear()).not.toBe(2020);
    expect(pilgrim.updatedAt?.getFullYear()).not.toBe(2020);
  });

  it('prevents mass assignment of protected pilgrim fields during update', async () => {
    // First create a legitimate pilgrim
    const created = await createPilgrim({
      firstName: 'Jane',
      lastName1: 'Smith',
      birthDate: '1985-05-15',
      documentType: 'dni',
      documentNumber: '987654',
      gender: 'F',
      phone: '+34611111111',
      addressCountry: 'ES',
      addressStreet: 'Main St',
      addressCity: 'Barcelona',
      addressPostalCode: '08001',
      consentGiven: true,
    });

    const originalConsentDate = created.consentDate;
    const originalCreatedAt = created.createdAt;

    // Attempt to update with protected fields
    const maliciousUpdate = {
      firstName: 'UpdatedName',
      // Attempt to modify server-controlled fields
      id: 88888,
      consentGiven: false,
      consentDate: new Date('2020-01-01'),
      dataRetentionUntil: new Date('2020-01-01'),
      createdAt: new Date('2020-01-01'),
      lastAccessDate: new Date('2020-01-01'),
    } as any;

    const updated = await updatePilgrim(created.id, maliciousUpdate);
    
    expect(updated).not.toBeNull();
    if (updated) {
      // User-modifiable field should be updated
      expect(updated.firstName).toBe('UpdatedName');
      
      // Protected fields should remain unchanged
      expect(updated.id).toBe(created.id);
      expect(updated.id).not.toBe(88888);
      expect(updated.consentGiven).toBe(true); // Should remain true
      expect(updated.consentDate?.getTime()).toBe(originalConsentDate?.getTime());
      expect(updated.createdAt?.getTime()).toBe(originalCreatedAt?.getTime());
    }
  });
});

describe('Pilgrim mass assignment vulnerability mitigation', () => {
  it('blocks unauthenticated POST to /api/pilgrims', async () => {
    const response = await app.request('/api/pilgrims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Attacker',
        lastName1: 'Test',
        birthDate: '1990-01-01',
        documentType: 'passport',
        documentNumber: 'ATTACK123',
        gender: 'M',
        phone: '+34600000000',
        addressCountry: 'ES',
        addressStreet: 'Attack St',
        addressCity: 'Madrid',
        addressPostalCode: '28001',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('blocks unauthenticated PUT to /api/pilgrims/:id', async () => {
    const response = await app.request('/api/pilgrims/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Hacked',
        consentGiven: false,
        dataRetentionUntil: new Date('2020-01-01'),
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('blocks unauthenticated PATCH to /api/pilgrims/:id/language', async () => {
    const response = await app.request('/api/pilgrims/1/language', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'en',
      }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('blocks unauthenticated DELETE to /api/pilgrims/:id', async () => {
    const response = await app.request('/api/pilgrims/1', {
      method: 'DELETE',
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('blocks unauthenticated POST to /api/pilgrims/batch', async () => {
    const response = await app.request('/api/pilgrims/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          firstName: 'Batch1',
          lastName1: 'Attack',
          birthDate: '1990-01-01',
          documentType: 'passport',
          documentNumber: 'BATCH1',
          gender: 'M',
          phone: '+34600000001',
          addressCountry: 'ES',
          addressStreet: 'Attack St',
          addressCity: 'Madrid',
          addressPostalCode: '28001',
        },
      ]),
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('allows unauthenticated GET to /api/pilgrims (read operations remain public)', async () => {
    const response = await app.request('/api/pilgrims');
    // Should not be 401 - read operations are public for guest booking flows
    expect(response.status).not.toBe(401);
  });

  it('prevents consentGiven manipulation during batch create', async () => {
    const maliciousBatch = [
      {
        firstName: 'Batch1',
        lastName1: 'Test',
        birthDate: '1990-01-01',
        documentType: 'passport',
        documentNumber: 'BATCH001',
        gender: 'M',
        phone: '+34600000001',
        addressCountry: 'ES',
        addressStreet: 'Test St',
        addressCity: 'Madrid',
        addressPostalCode: '28001',
        consentGiven: true,
        // Attempt to set server-controlled fields
        id: 77777,
        createdAt: new Date('2020-01-01'),
        dataRetentionUntil: new Date('2099-01-01'),
        lastAccessDate: new Date('2020-01-01'),
      } as any,
      {
        firstName: 'Batch2',
        lastName1: 'Test',
        birthDate: '1991-02-02',
        documentType: 'dni',
        documentNumber: 'BATCH002',
        gender: 'F',
        phone: '+34600000002',
        addressCountry: 'ES',
        addressStreet: 'Test St 2',
        addressCity: 'Barcelona',
        addressPostalCode: '08001',
        consentGiven: false, // Attempt to set consent to false
        consentDate: new Date('2020-01-01'),
      } as any,
    ];

    const pilgrims = await createPilgrimsBatch(maliciousBatch);
    
    expect(pilgrims).toHaveLength(2);
    
    // Verify server-controlled fields were not set from input
    expect(pilgrims[0].id).not.toBe(77777);
    expect(pilgrims[0].createdAt?.getFullYear()).not.toBe(2020);
    
    // consentGiven can be set by user during creation, but other protected fields cannot
    expect(pilgrims[1].consentGiven).toBe(false); // This is allowed during creation
    // But consentDate should be server-controlled
    expect(pilgrims[1].consentDate?.getFullYear()).not.toBe(2020);
  });

  it('prevents protected field manipulation during bulk update', async () => {
    // Create test pilgrims
    const pilgrim1 = await createPilgrim({
      firstName: 'BulkTest1',
      lastName1: 'Original',
      birthDate: '1990-01-01',
      documentType: 'passport',
      documentNumber: 'BULK001',
      gender: 'M',
      phone: '+34600000011',
      addressCountry: 'ES',
      addressStreet: 'Original St',
      addressCity: 'Madrid',
      addressPostalCode: '28001',
      consentGiven: true,
    });

    const pilgrim2 = await createPilgrim({
      firstName: 'BulkTest2',
      lastName1: 'Original',
      birthDate: '1991-02-02',
      documentType: 'dni',
      documentNumber: 'BULK002',
      gender: 'F',
      phone: '+34600000012',
      addressCountry: 'ES',
      addressStreet: 'Original St 2',
      addressCity: 'Barcelona',
      addressPostalCode: '08001',
      consentGiven: true,
    });

    const originalConsent1 = pilgrim1.consentGiven;
    const originalConsent2 = pilgrim2.consentGiven;
    const originalCreatedAt1 = pilgrim1.createdAt;
    const originalCreatedAt2 = pilgrim2.createdAt;

    // Attempt bulk update with protected fields
    const maliciousUpdate = {
      lastName1: 'BulkUpdated',
      // Attempt to modify protected fields
      consentGiven: false,
      consentDate: new Date('2020-01-01'),
      dataRetentionUntil: new Date('2020-01-01'),
      createdAt: new Date('2020-01-01'),
      lastAccessDate: new Date('2020-01-01'),
    } as any;

    const updateCount = await bulkUpdatePilgrims([pilgrim1.id, pilgrim2.id], maliciousUpdate);
    
    expect(updateCount).toBe(2);

    // Verify updates - need to fetch the updated records
    const { getPilgrimById } = await import('../queries/pilgrims.js');
    const updated1 = await getPilgrimById(pilgrim1.id);
    const updated2 = await getPilgrimById(pilgrim2.id);

    expect(updated1).not.toBeNull();
    expect(updated2).not.toBeNull();

    if (updated1 && updated2) {
      // User-modifiable field should be updated
      expect(updated1.lastName1).toBe('BulkUpdated');
      expect(updated2.lastName1).toBe('BulkUpdated');

      // Protected fields should remain unchanged
      expect(updated1.consentGiven).toBe(originalConsent1);
      expect(updated2.consentGiven).toBe(originalConsent2);
      expect(updated1.createdAt?.getTime()).toBe(originalCreatedAt1?.getTime());
      expect(updated2.createdAt?.getTime()).toBe(originalCreatedAt2?.getTime());
    }
  });

  it('prevents primary key reassignment via update', async () => {
    // Create a test pilgrim
    const pilgrim = await createPilgrim({
      firstName: 'PKTest',
      lastName1: 'Original',
      birthDate: '1990-01-01',
      documentType: 'passport',
      documentNumber: 'PK001',
      gender: 'M',
      phone: '+34600000020',
      addressCountry: 'ES',
      addressStreet: 'PK St',
      addressCity: 'Madrid',
      addressPostalCode: '28001',
    });

    const originalId = pilgrim.id;

    // Attempt to change the primary key
    const maliciousUpdate = {
      firstName: 'PKHacked',
      id: 99999,
    } as any;

    const updated = await updatePilgrim(pilgrim.id, maliciousUpdate);
    
    expect(updated).not.toBeNull();
    if (updated) {
      // ID should remain unchanged
      expect(updated.id).toBe(originalId);
      expect(updated.id).not.toBe(99999);
      // But the allowed field should be updated
      expect(updated.firstName).toBe('PKHacked');
    }
  });

  it('prevents lifecycle timestamp manipulation via update', async () => {
    // Create a test pilgrim
    const pilgrim = await createPilgrim({
      firstName: 'TimestampTest',
      lastName1: 'Original',
      birthDate: '1990-01-01',
      documentType: 'passport',
      documentNumber: 'TS001',
      gender: 'M',
      phone: '+34600000030',
      addressCountry: 'ES',
      addressStreet: 'TS St',
      addressCity: 'Madrid',
      addressPostalCode: '28001',
    });

    const originalCreatedAt = pilgrim.createdAt;
    const originalUpdatedAt = pilgrim.updatedAt;

    // Wait a bit to ensure timestamps would differ
    await new Promise(resolve => setTimeout(resolve, 10));

    // Attempt to manipulate timestamps
    const maliciousUpdate = {
      firstName: 'TimestampHacked',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      lastAccessDate: new Date('2020-01-01'),
      consentDate: new Date('2020-01-01'),
      dataRetentionUntil: new Date('2099-12-31'),
    } as any;

    const updated = await updatePilgrim(pilgrim.id, maliciousUpdate);
    
    expect(updated).not.toBeNull();
    if (updated) {
      // createdAt should remain unchanged
      expect(updated.createdAt?.getTime()).toBe(originalCreatedAt?.getTime());
      expect(updated.createdAt?.getFullYear()).not.toBe(2020);
      
      // updatedAt should be automatically set to current time, not the malicious value
      expect(updated.updatedAt?.getTime()).not.toBe(originalUpdatedAt?.getTime());
      expect(updated.updatedAt?.getFullYear()).not.toBe(2020);
      
      // Other protected timestamps should remain unchanged
      expect(updated.dataRetentionUntil).toBe(pilgrim.dataRetentionUntil);
      
      // But the allowed field should be updated
      expect(updated.firstName).toBe('TimestampHacked');
    }
  });
});
