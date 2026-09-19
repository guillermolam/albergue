/**
 * Pricing Queries
 * Read operations for pricing
 */

import { db } from "../lib/db.js";
import { beds, pricing } from "@albergue/domain-model";
import { eq, and, or, like, count, desc, asc, sql } from "drizzle-orm";
import type { Pricing } from "../types/index.js";
import type { PaginatedResponse, PaginationParams } from "../types/index.js";

export interface BookingQuote {
  bedId: number;
  numberOfNights: number;
  pricePerNight: string;
  totalAmount: string;
  currency: string;
}

/**
 * BOOK-001: authoritative server-side quote.
 * Price source is the bed row itself (`beds.pricePerNight`); the browser's
 * posted total is never trusted. Returns null when the bed does not exist.
 */
export async function computeBookingQuote(
  bedId: number,
  checkInDate: string,
  checkOutDate: string,
): Promise<BookingQuote | null> {
  const [bed] = await db
    .select({
      id: beds.id,
      pricePerNight: beds.pricePerNight,
      currency: beds.currency,
    })
    .from(beds)
    .where(eq(beds.id, bedId))
    .limit(1);

  if (!bed) return null;

  const numberOfNights = Math.round(
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
      (24 * 60 * 60 * 1000),
  );
  if (numberOfNights < 1) return null;

  return {
    bedId,
    numberOfNights,
    pricePerNight: bed.pricePerNight,
    totalAmount: (Number(bed.pricePerNight) * numberOfNights).toFixed(2),
    currency: bed.currency ?? "EUR",
  };
}

/**
 * Get all pricing entries with pagination
 */
export async function getAllPricing(
  params: PaginationParams = {},
): Promise<PaginatedResponse<Pricing>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = "createdAt",
    orderDirection = "desc",
  } = params;

  const offset = (page - 1) * pageSize;
  const orderFn = orderDirection === "asc" ? asc : desc;

  // Get total count
  const [countResult] = await db.select({ count: count() }).from(pricing);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(pricing)
    .orderBy(
      orderFn(
        orderBy in pricing ? (pricing as any)[orderBy] : pricing.createdAt,
      ),
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
    .orderBy(asc(pricing.roomType));

  return results;
}

/**
 * Get pricing by room type
 */
export async function getPricingByRoomType(
  roomType: string,
): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.roomType, roomType))
    .orderBy(asc(pricing.bedType));

  return results;
}

/**
 * Get pricing by room type and bed type
 */
export async function getPricingByRoomAndBedType(
  roomType: string,
  bedType: string,
): Promise<Pricing | null> {
  const [result] = await db
    .select()
    .from(pricing)
    .where(and(eq(pricing.roomType, roomType), eq(pricing.bedType, bedType)))
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
    .orderBy(asc(pricing.roomType));

  return results;
}

/**
 * Get pricing by currency
 */
export async function getPricingByCurrency(
  currency: string,
): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(eq(pricing.currency, currency))
    .orderBy(asc(pricing.roomType));

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
    .orderBy(desc(pricing.updatedAt));

  return results;
}

/**
 * Search pricing
 */
export async function searchPricing(
  query: string,
  limit: number = 10,
): Promise<Pricing[]> {
  const results = await db
    .select()
    .from(pricing)
    .where(
      or(
        like(pricing.roomType, `%${query}%`),
        like(pricing.bedType, `%${query}%`),
      ),
    )
    .orderBy(asc(pricing.roomType))
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
    .orderBy(desc(pricing.createdAt))
    .limit(limit);

  return results;
}

/**
 * Get pricing statistics
 */
export async function getPricingStats() {
  const [total] = await db.select({ count: count() }).from(pricing);

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
    roomTypes: roomTypes.map((r) => r.roomType),
    bedTypes: bedTypes.map((r) => r.bedType),
  };
}

/**
 * Get average price by room type
 */
export async function getAveragePriceByRoomType(
  roomType: string,
): Promise<string | null> {
  const [result] = await db
    .select({
      // @ts-ignore
      avg: avg(pricing.pricePerNight),
    })
    .from(pricing)
    .where(and(eq(pricing.roomType, roomType), eq(pricing.isActive, true)));

  return result?.avg != null ? String(result.avg) : null;
}

// Helper for average
function avg(column: any) {
  return sql`AVG(${column}::numeric)`;
}
