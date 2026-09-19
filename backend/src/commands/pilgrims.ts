/**
 * Pilgrim Commands
 * Write operations for pilgrims
 */

import { db } from '../lib/db.js';
import { pilgrims } from '@albergue/domain-model';
import { eq, and, lte, inArray } from 'drizzle-orm';
import type { InsertPilgrim, UpdatePilgrimInput, Pilgrim } from '../types/index.js';

// Fields a client may set directly. Excludes server-controlled fields
// (id, createdAt, updatedAt, consentDate, dataRetentionUntil, lastAccessDate)
// — these are set by consent/retention/access-tracking logic, never by the
// request body, otherwise a client could mass-assign its own retention
// window or fake a consent timestamp.
const WRITABLE_PILGRIM_FIELDS = [
  'firstName', 'lastName1', 'lastName2', 'birthDate', 'documentType',
  'documentNumber', 'documentSupport', 'gender', 'nationality', 'phone',
  'email', 'addressCountry', 'addressStreet', 'addressStreet2', 'addressCity',
  'addressPostalCode', 'addressProvince', 'addressMunicipalityCode',
  'idPhotoUrl', 'language', 'consentGiven',
] as const satisfies readonly (keyof InsertPilgrim & keyof UpdatePilgrimInput)[];

// Returns T (not Partial<T>): stripping disallowed keys doesn't change what
// the caller already promised about which of T's fields are present — same
// trust level as the original `...input` spread, just without the extras.
export function pickWritableFields<T extends Partial<InsertPilgrim>>(input: T): T {
  const entries = WRITABLE_PILGRIM_FIELDS
    .filter((field) => input[field] !== undefined)
    .map((field) => [field, input[field]] as const);
  return Object.fromEntries(entries) as T;
}

/**
 * Create a new pilgrim
 */
export async function createPilgrim(input: InsertPilgrim): Promise<Pilgrim> {
  const sanitized = pickWritableFields(input);
  const [result] = await db
    .insert(pilgrims)
    .values({
      ...sanitized,
      // Ensure encrypted fields are properly handled
      firstName: sanitized.firstName || '',
      lastName1: sanitized.lastName1 || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result) {
    throw new Error('Failed to create pilgrim');
  }

  return result;
}

/**
 * Create multiple pilgrims (batch)
 */
export async function createPilgrimsBatch(inputs: InsertPilgrim[]): Promise<Pilgrim[]> {
  const results = await db
    .insert(pilgrims)
    .values(
      inputs.map(input => {
        const sanitized = pickWritableFields(input);
        return {
          ...sanitized,
          firstName: sanitized.firstName || '',
          lastName1: sanitized.lastName1 || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    )
    .returning();

  return results;
}

/**
 * Update a pilgrim
 */
export async function updatePilgrim(id: number, input: UpdatePilgrimInput): Promise<Pilgrim | null> {
  const [existing] = await db
    .select()
    .from(pilgrims)
    .where(eq(pilgrims.id, id))
    .limit(1);

  if (!existing) {
    return null;
  }

  const [result] = await db
    .update(pilgrims)
    .set({
      ...pickWritableFields(input),
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return result || null;
}

/**
 * Delete a pilgrim (soft delete - mark as inactive)
 * Note: We don't hard delete to preserve data integrity. Clears every PII
 * field the pilgrims table holds, not just name/contact, so a "deleted"
 * record can't still leak document/address data through the admin API.
 */
export async function softDeletePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      // Mark fields that indicate deletion
      firstName: '(DELETED)',
      lastName1: '(DELETED)',
      lastName2: null,
      email: null, // nullable column — null marks erased data
      phone: '(DELETED)', // NOT NULL column — tombstone marker, not ''
      birthDate: '(DELETED)',
      documentNumber: '(DELETED)',
      documentSupport: null,
      addressStreet: '(DELETED)',
      addressStreet2: null,
      addressCity: '(DELETED)',
      addressPostalCode: '00000',
      addressProvince: null,
      addressMunicipalityCode: null,
      idPhotoUrl: null,
      consentGiven: false,
      consentDate: null,
      dataRetentionUntil: new Date(), // Expire data immediately
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Delete a pilgrim (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deletePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .delete(pilgrims)
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Deactivate a pilgrim (set consent to false)
 */
export async function deactivatePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      consentGiven: false,
      consentDate: null,
      dataRetentionUntil: new Date(), // Expire data immediately
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's last access date
 */
export async function updatePilgrimLastAccess(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      lastAccessDate: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's language preference
 */
export async function updatePilgrimLanguage(id: number, language: string): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      language,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's document information
 */
export async function updatePilgrimDocument(
  id: number,
  documentInfo: {
    documentType?: string;
    documentNumber?: string;
    documentSupport?: string;
  }
): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      ...documentInfo,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Bulk update pilgrims
 */
export async function bulkUpdatePilgrims(
  ids: number[],
  updates: Partial<UpdatePilgrimInput>
): Promise<number> {
  if (ids.length === 0) return 0;

  const results = await db
    .update(pilgrims)
    .set({
      ...pickWritableFields(updates),
      updatedAt: new Date(),
    })
    .where(inArray(pilgrims.id, ids))
    .returning();

  return results.length;
}

/**
 * Cleanup old pilgrim records
 * Removes pilgrims with expired data retention
 */
export async function cleanupExpiredPilgrims(): Promise<number> {
  const now = new Date();

  const results = await db
    .delete(pilgrims)
    .where(
      and(
        eq(pilgrims.consentGiven, false),
        lte(pilgrims.dataRetentionUntil, now)
      )
    )
    .returning();

  // Return count of deleted records
  return results.length;
}
