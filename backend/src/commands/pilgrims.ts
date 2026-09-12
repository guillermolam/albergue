/**
 * Pilgrim Commands
 * Write operations for pilgrims
 */

import { db } from '../lib/db.js';
import { pilgrims } from '@albergue/domain-model';
import { eq, and, lte } from 'drizzle-orm';
import type { InsertPilgrim, UpdatePilgrimInput, Pilgrim } from '../types/index.js';

/**
 * Create a new pilgrim
 */
export async function createPilgrim(input: InsertPilgrim): Promise<Pilgrim> {
  const [result] = await db
    .insert(pilgrims)
    .values({
      ...input,
      // Ensure encrypted fields are properly handled
      firstName: input.firstName || '',
      lastName1: input.lastName1 || '',
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
      inputs.map(input => ({
        ...input,
        firstName: input.firstName || '',
        lastName1: input.lastName1 || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
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
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return result || null;
}

/**
 * Delete a pilgrim (soft delete - mark as inactive)
 * Note: We don't hard delete to preserve data integrity
 */
export async function softDeletePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      // Mark fields that indicate deletion
      firstName: '(DELETED)',
      lastName1: '(DELETED)',
      email: null, // nullable column — null marks erased data
      phone: '(DELETED)', // NOT NULL column — tombstone marker, not ''
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
  const results = await db
    .update(pilgrims)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(
      // @ts-ignore
      inArray(pilgrims.id, ids)
    ))
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
