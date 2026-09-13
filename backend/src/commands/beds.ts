/**
 * Bed Commands
 * Write operations for beds
 */

import { db } from '../lib/db.js';
import { beds } from '@albergue/domain-model';
import { eq, and, or, isNull, lte, inArray } from 'drizzle-orm';
import type { InsertBed, UpdateBedInput, Bed } from '../types/index.js';

/**
 * Create a new bed
 */
export async function createBed(input: InsertBed): Promise<Bed> {
  const [result] = await db
    .insert(beds)
    .values({
      ...input,
      bedNumber: input.bedNumber || 1,
      roomNumber: input.roomNumber || 1,
      roomName: input.roomName || 'Unknown',
      pricePerNight: input.pricePerNight || '15.00',
      currency: input.currency || 'EUR',
      isAvailable: input.isAvailable !== undefined ? input.isAvailable : true,
      status: input.status || 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create bed');
  }
  
  return result;
}

/**
 * Create multiple beds (batch)
 */
export async function createBedsBatch(inputs: InsertBed[]): Promise<Bed[]> {
  const results = await db
    .insert(beds)
    .values(
      inputs.map(input => ({
        ...input,
        bedNumber: input.bedNumber || 1,
        roomNumber: input.roomNumber || 1,
        roomName: input.roomName || 'Unknown',
        pricePerNight: input.pricePerNight || '15.00',
        currency: input.currency || 'EUR',
        isAvailable: input.isAvailable !== undefined ? input.isAvailable : true,
        status: input.status || 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Update a bed
 */
export async function updateBed(id: number, input: UpdateBedInput): Promise<Bed | null> {
  const [existing] = await db
    .select()
    .from(beds)
    .where(eq(beds.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }
  
  // Allowlist of fields that can be updated to prevent unauthorized modification
  // of critical operational state. The primary key 'id' is explicitly excluded.
  const allowedFields: (keyof UpdateBedInput)[] = [
    'bedNumber',
    'roomNumber',
    'roomName',
    'roomType',
    'pricePerNight',
    'currency',
    'isAvailable',
    'status',
    'maintenanceNotes',
    'lastCleanedAt',
    'reservedUntil'
  ];
  
  const sanitizedInput: Partial<UpdateBedInput> = {};
  for (const field of allowedFields) {
    if (field in input && input[field] !== undefined) {
      sanitizedInput[field] = input[field];
    }
  }
  
  const [result] = await db
    .update(beds)
    .set({
      ...sanitizedInput,
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return result || null;
}

/**
 * Update bed availability
 */
export async function updateBedAvailability(
  id: number,
  isAvailable: boolean,
  status?: string
): Promise<boolean> {
  const [result] = await db
    .update(beds)
    .set({
      isAvailable,
      status: status || (isAvailable ? 'available' : 'unavailable'),
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Reserve a bed
 */
export async function reserveBed(
  id: number,
  reservedUntil: Date,
  status: string = 'reserved'
): Promise<boolean> {
  // Atomic claim: only an available bed can be reserved.
  const [result] = await db
    .update(beds)
    .set({
      isAvailable: false,
      status,
      reservedUntil,
      updatedAt: new Date(),
    })
    .where(and(eq(beds.id, id), eq(beds.isAvailable, true)))
    .returning();
  
  return !!result;
}

/**
 * Release a bed (make available again)
 */
export async function releaseBed(id: number): Promise<boolean> {
  const [result] = await db
    .update(beds)
    .set({
      isAvailable: true,
      status: 'available',
      reservedUntil: null,
      lastCleanedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update bed maintenance info
 */
export async function updateBedMaintenance(
  id: number,
  notes: string,
  lastCleanedAt?: Date
): Promise<boolean> {
  const [result] = await db
    .update(beds)
    .set({
      maintenanceNotes: notes,
      lastCleanedAt: lastCleanedAt || new Date(),
      status: 'maintenance',
      isAvailable: false,
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update bed pricing
 */
export async function updateBedPricing(
  id: number,
  pricePerNight: string,
  currency?: string
): Promise<boolean> {
  const [result] = await db
    .update(beds)
    .set({
      pricePerNight,
      currency: currency || 'EUR',
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a bed (soft delete)
 */
export async function softDeleteBed(id: number): Promise<boolean> {
  const [result] = await db
    .update(beds)
    .set({
      roomName: '(DELETED)',
      roomNumber: -1,
      bedNumber: -1,
      isAvailable: false,
      status: 'deleted',
      updatedAt: new Date(),
    })
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a bed (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deleteBed(id: number): Promise<boolean> {
  const [result] = await db
    .delete(beds)
    .where(eq(beds.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk update beds
 */
export async function bulkUpdateBeds(
  ids: number[],
  updates: Partial<UpdateBedInput>
): Promise<number> {
  if (ids.length === 0) return 0;
  
  // Allowlist of fields that can be updated to prevent unauthorized modification
  // of critical operational state. The primary key 'id' is explicitly excluded.
  const allowedFields: (keyof UpdateBedInput)[] = [
    'bedNumber',
    'roomNumber',
    'roomName',
    'roomType',
    'pricePerNight',
    'currency',
    'isAvailable',
    'status',
    'maintenanceNotes',
    'lastCleanedAt',
    'reservedUntil'
  ];
  
  const sanitizedUpdates: Partial<UpdateBedInput> = {};
  for (const field of allowedFields) {
    if (field in updates && updates[field] !== undefined) {
      sanitizedUpdates[field] = updates[field];
    }
  }
  
  const results = await db
    .update(beds)
    .set({
      ...sanitizedUpdates,
      updatedAt: new Date(),
    })
    .where(inArray(beds.id, ids))
    .returning();
  
  return results.length;
}

/**
 * Cleanup beds - reset unavailable beds that have expired reservations
 */
export async function cleanupExpiredReservations(): Promise<number> {
  const now = new Date();
  
  const results = await db
    .update(beds)
    .set({
      isAvailable: true,
      status: 'available',
      reservedUntil: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(beds.isAvailable, false),
        eq(beds.status, 'reserved'),
        // @ts-ignore
        or(
          isNull(beds.reservedUntil),
          lte(beds.reservedUntil, now)
        )
      )
    )
    .returning();
  
  return results.length;
}
