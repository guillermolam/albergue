/**
 * Pricing Queries
 * Read operations for pricing
 */

import { db } from '../lib/db';
import { pricing } from '../../domain_model/schema';
import { eq, and, or, like, count, desc, asc } from 'drizzle-orm';
import type { Pricing } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all pricing entries with pagination
 */
export async function getAllPricing(
  params: PaginationParams = {}
): Promise<PaginatedResponse<Pricing>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = 'createdAt',
    orderDirection = 'desc',
  } = params;

  const offset = (page - 1) * pageSize;
  const order = orderDirection === 'asc' ? asc : desc;

  // Get total count
  const [countResult] = await db
    .select({ count: count() })
    .from(pricing);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(pricing)
    .orderBy(
      // @ts-ignore
      orderBy in pricing ? pricing[orderBy] : pricing.createdAt,
      order
    )
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: results,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get pricing by ID
 */
export async function getPricingById(id: number): Promise<Pricing | null> {
  const [result] = await db
    .select()
    .from(pricing)
    .where(eq(pricing.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get active pricing
 */
export async function getActivePricing(): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.isActive, true))
    .orderBy(pricing.roomType, asc);
  
  return results;
}

/**
 * Get pricing by room type
 */
export async function getPricingByRoomType(roomType: string): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.roomType, roomType))
    .orderBy(pricing.bedType, asc);
  
  return results;
}

/**
 * Get pricing by room type and bed type
 */
export async function getPricingByRoomAndBedType(
  roomType: string,
  bedType: string
): Promise<Pricing | null> {
  const [result] = await db
    .select()
    .from(pricing)
    .where(
      and(
        eq(pricing.roomType, roomType),
        eq(pricing.bedType, bedType)
      )
    )
    .limit(1);
  
  return result || null;
}

/**
 * Get pricing by bed type
 */
export async function getPricingByBedType(bedType: string): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.bedType, bedType))
    .orderBy(pricing.roomType, asc);
  
  return results;
}

/**
 * Get pricing by currency
 */
export async function getPricingByCurrency(currency: string): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.currency, currency))
    .orderBy(pricing.roomType, asc);
  
  return results;
}

/**
 * Get inactive pricing
 */
export async function getInactivePricing(): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.isActive, false))
    .orderBy(pricing.updatedAt, desc);
  
  return results;
}

/**
 * Search pricing
 */
export async function searchPricing(query: string, limit: number = 10): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(
      or(
        like(pricing.roomType, `%${query}%`),
        like(pricing.bedType, `%${query}%`)
      )
    )
    .orderBy(pricing.roomType, asc)
    .limit(limit);
  
  return results;
}

/**
 * Get recent pricing
 */
export async function getRecentPricing(limit: number = 5): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .orderBy(pricing.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get pricing statistics
 */
export async function getPricingStats() {
  const [total] = await db
    .select({ count: count() })
    .from(pricing);

  const [active] = await db
    .select({ count: count() })
    .from(pricing)
    .where(eq(pricing.isActive, true));

  const [inactive] = await db
    .select({ count: count() })
    .from(pricing)
    .where(eq(pricing.isActive, false));

  // Unique room types
  const roomTypes = await db
    .select({ roomType: pricing.roomType })
    .from(pricing)
    .groupBy(pricing.roomType);

  // Unique bed types
  const bedTypes = await db
    .select({ bedType: pricing.bedType })
    .from(pricing)
    .groupBy(pricing.bedType);

  return {
    totalPricing: total?.count || 0,
    activePricing: active?.count || 0,
    inactivePricing: inactive?.count || 0,
    roomTypeCount: roomTypes.length,
    bedTypeCount: bedTypes.length,
    roomTypes: roomTypes.map(r => r.roomType),
    bedTypes: bedTypes.map(r => r.bedType),
  };
}

/**
 * Get average price by room type
 */
export async function getAveragePriceByRoomType(roomType: string): Promise<string | null> {
  const [result] = await db
    .select({
      // @ts-ignore
      avg: avg(pricing.pricePerNight)
    })
    .from(pricing)
    .where(
      and(
        eq(pricing.roomType, roomType),
        eq(pricing.isActive, true)
      )
    );
  
  return result?.avg || null;
}

// Helper for average
function avg(column: any) {
  return { avg: sql`AVG(${column}::numeric)` };
}
