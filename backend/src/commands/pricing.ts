/**
 * Pricing Commands
 * Write operations for pricing
 */

import { db } from '../lib/db';
import { pricing } from '../../domain_model/schema';
import { eq, and } from 'drizzle-orm';
import type { InsertPricing, UpdatePricingInput, Pricing } from '../types';

/**
 * Create a new pricing entry
 */
export async function createPricing(input: InsertPricing): Promise<Pricing> {
  const [result] = await db
    .insert(pricing)
    .values({
      ...input,
      isActive: input.isActive !== undefined ? input.isActive : true,
      currency: input.currency || 'EUR',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create pricing');
  }
  
  return result;
}

/**
 * Create multiple pricing entries (batch)
 */
export async function createPricingBatch(inputs: InsertPricing[]): Promise<Pricing[]> {
  const results = await db
    .insert(pricing)
    .values(
      inputs.map(input => ({
        ...input,
        isActive: input.isActive !== undefined ? input.isActive : true,
        currency: input.currency || 'EUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Update a pricing entry
 */
export async function updatePricing(id: number, input: UpdatePricingInput): Promise<Pricing | null> {
  const [existing] = await db
    .select()
    .from(pricing)
    .where(eq(pricing.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }
  
  const [result] = await db
    .update(pricing)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricing.id, id))
    .returning();
  
  return result || null;
}

/**
 * Activate a pricing entry
 */
export async function activatePricing(id: number): Promise<boolean> {
  const [result] = await db
    .update(pricing)
    .set({
      isActive: true,
      updatedAt: new Date(),
    })
    .where(eq(pricing.id, id))
    .returning();
  
  return !!result;
}

/**
 * Deactivate a pricing entry
 */
export async function deactivatePricing(id: number): Promise<boolean> {
  const [result] = await db
    .update(pricing)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(pricing.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update pricing amount
 */
export async function updatePricingAmount(
  id: number,
  pricePerNight: string,
  currency?: string
): Promise<boolean> {
  const [result] = await db
    .update(pricing)
    .set({
      pricePerNight,
      currency: currency || 'EUR',
      updatedAt: new Date(),
    })
    .where(eq(pricing.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a pricing entry (soft delete)
 */
export async function softDeletePricing(id: number): Promise<boolean> {
  const [result] = await db
    .update(pricing)
    .set({
      isActive: false,
      roomType: '(DELETED)',
      bedType: '(DELETED)',
      pricePerNight: '0.00',
      updatedAt: new Date(),
    })
    .where(eq(pricing.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a pricing entry (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deletePricing(id: number): Promise<boolean> {
  const [result] = await db
    .delete(pricing)
    .where(eq(pricing.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk update pricing
 */
export async function bulkUpdatePricing(
  ids: number[],
  updates: Partial<UpdatePricingInput>
): Promise<number> {
  const results = await db
    .update(pricing)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(...ids.map(id => eq(pricing.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Set default pricing for room type
 */
export async function setDefaultPricingForRoomType(
  roomType: string,
  pricePerNight: string,
  bedType?: string
): Promise<Pricing> {
  // Deactivate existing pricing for this room type
  await db
    .update(pricing)
    .set({ isActive: false, updatedAt: new Date() })
    .where(
      and(
        eq(pricing.roomType, roomType),
        bedType ? eq(pricing.bedType, bedType) : undefined
      )
    );
  
  // Create new pricing
  const [result] = await db
    .insert(pricing)
    .values({
      roomType,
      bedType: bedType || roomType,
      pricePerNight,
      currency: 'EUR',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to set default pricing');
  }
  
  return result;
}
