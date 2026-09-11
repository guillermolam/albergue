/**
 * Bed Queries
 * Read operations for beds
 */

import { db } from '../lib/db';
import { beds, bookings } from '../../domain_model/schema';
import { eq, and, or, like, count, desc, asc, gte, lte, isNull } from 'drizzle-orm';
import type { Bed } from '../types';
import type { PaginatedResponse, PaginationParams, BedFilter, BedStats } from '../types';

/**
 * Get all beds with pagination
 */
export async function getAllBeds(
  params: PaginationParams & BedFilter = {}
): Promise<PaginatedResponse<Bed>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = 'roomNumber',
    orderDirection = 'asc',
    roomType,
    roomNumber,
    isAvailable,
    status,
  } = params;

  const offset = (page - 1) * pageSize;
  const order = orderDirection === 'asc' ? asc : desc;

  // Build where conditions
  const whereConditions = [];
  
  if (roomType) {
    whereConditions.push(eq(beds.roomType, roomType));
  }
  
  if (roomNumber) {
    whereConditions.push(eq(beds.roomNumber, roomNumber));
  }
  
  if (isAvailable !== undefined) {
    whereConditions.push(eq(beds.isAvailable, isAvailable));
  }
  
  if (status) {
    whereConditions.push(eq(beds.status, status));
  }

  // Get total count
  const [countResult] = await db
    .select({ count: count() })
    .from(beds)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(beds)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(
      // @ts-ignore
      orderBy in beds ? beds[orderBy] : beds.roomNumber,
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
 * Get bed by ID
 */
export async function getBedById(id: number): Promise<Bed | null> {
  const [result] = await db
    .select()
    .from(beds)
    .where(eq(beds.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get bed by room number and bed number
 */
export async function getBedByRoomAndNumber(
  roomNumber: number,
  bedNumber: number
): Promise<Bed | null> {
  const [result] = await db
    .select()
    .from(beds)
    .where(
      and(
        eq(beds.roomNumber, roomNumber),
        eq(beds.bedNumber, bedNumber)
      )
    )
    .limit(1);
  
  return result || null;
}

/**
 * Get available beds
 */
export async function getAvailableBeds(): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, true),
        or(
          eq(beds.status, 'available'),
          eq(beds.status, 'cleaned')
        )
      )
    )
    .orderBy(beds.roomNumber, asc);
  
  return results;
}

/**
 * Get occupied beds
 */
export async function getOccupiedBeds(): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, false),
        or(
          eq(beds.status, 'reserved'),
          eq(beds.status, 'occupied')
        )
      )
    )
    .orderBy(beds.roomNumber, asc);
  
  return results;
}

/**
 * Get beds in maintenance
 */
export async function getBedsInMaintenance(): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(eq(beds.status, 'maintenance'))
    .orderBy(beds.roomNumber, asc);
  
  return results;
}

/**
 * Get beds by room type
 */
export async function getBedsByRoomType(roomType: string): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(eq(beds.roomType, roomType))
    .orderBy(beds.roomNumber, asc);
  
  return results;
}

/**
 * Get beds by room number
 */
export async function getBedsByRoomNumber(roomNumber: number): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(eq(beds.roomNumber, roomNumber))
    .orderBy(beds.bedNumber, asc);
  
  return results;
}

/**
 * Search beds by room name
 */
export async function searchBeds(query: string, limit: number = 10): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(
      like(beds.roomName, `%${query}%`)
    )
    .orderBy(beds.roomNumber, asc)
    .limit(limit);
  
  return results;
}

/**
 * Get bed statistics
 */
export async function getBedStats(): Promise<BedStats> {
  const [total] = await db
    .select({ count: count() })
    .from(beds);

  const [available] = await db
    .select({ count: count() })
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, true),
        or(
          eq(beds.status, 'available'),
          eq(beds.status, 'cleaned')
        )
      )
    );

  const [occupied] = await db
    .select({ count: count() })
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, false),
        or(
          eq(beds.status, 'reserved'),
          eq(beds.status, 'occupied')
        )
      )
    );

  const roomTypeStats = await db
    .select({
      roomType: beds.roomType,
      total: count(beds.id),
      available: count(
        and(
          eq(beds.isAvailable, true),
          or(
            eq(beds.status, 'available'),
            eq(beds.status, 'cleaned')
          )
        )
      ),
    })
    .from(beds)
    .groupBy(beds.roomType);

  return {
    totalBeds: total?.count || 0,
    availableBeds: available?.count || 0,
    occupiedBeds: occupied?.count || 0,
    byRoomType: Object.fromEntries(
      roomTypeStats.map(s => [
        s.roomType || 'unknown',
        {
          total: s.total || 0,
          available: s.available || 0,
        }
      ])
    ),
  };
}

/**
 * Get recent beds
 */
export async function getRecentBeds(limit: number = 5): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .orderBy(beds.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get beds with bookings
 */
export async function getBedsWithBookings(): Promise<Bed[]> {
  const results = await db
    .select({ bed: beds })
    .from(beds)
    .innerJoin(bookings, eq(bookings.bedAssignmentId, beds.id))
    .groupBy(beds.id);
  
  return results.map(r => r.bed);
}

/**
 * Get beds that will be available on a specific date
 */
export async function getBedsAvailableOnDate(date: Date): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .leftJoin(
      bookings,
      and(
        eq(bookings.bedAssignmentId, beds.id),
        eq(bookings.status, 'reserved'),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, new Date())
        ),
        // Check for date overlap
        or(
          // @ts-ignore
          and(
            lte(bookings.checkInDate, date),
            gte(bookings.checkOutDate, date)
          )
        )
      )
    )
    .where(
      or(
        isNull(bookings.id),
        // Bed is not reserved for this date
        and(
          isNull(bookings.bedAssignmentId),
          // Or reservation doesn't overlap
          or(
            // @ts-ignore
            bookings.checkInDate.gt(date),
            // @ts-ignore
            bookings.checkOutDate.lt(date)
          )
        )
      )
    )
    .orderBy(beds.roomNumber, asc);
  
  return results;
}
