/**
 * Bed Queries
 * Read operations for beds
 */

import { db } from "../lib/db.js";
import { beds, bookings, pilgrims } from "@albergue/domain-model";
import {
  eq,
  and,
  or,
  like,
  count,
  desc,
  asc,
  gte,
  lte,
  gt,
  lt,
  isNull,
} from "drizzle-orm";
import type { Bed } from "../types/index.js";
import type {
  PaginatedResponse,
  PaginationParams,
  BedFilter,
  BedStats,
  BedWithGuest,
} from "../types/index.js";

/**
 * Get all beds with pagination
 */
export async function getAllBeds(
  params: PaginationParams & BedFilter = {},
): Promise<PaginatedResponse<Bed>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = "roomNumber",
    orderDirection = "asc",
    roomType,
    roomNumber,
    isAvailable,
    status,
  } = params;

  const offset = (page - 1) * pageSize;
  const orderFn = orderDirection === "asc" ? asc : desc;

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
      orderFn(orderBy in beds ? (beds as any)[orderBy] : beds.roomNumber),
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
  const [result] = await db.select().from(beds).where(eq(beds.id, id)).limit(1);

  return result || null;
}

/**
 * Get bed by room number and bed number
 */
export async function getBedByRoomAndNumber(
  roomNumber: number,
  bedNumber: number,
): Promise<Bed | null> {
  const [result] = await db
    .select()
    .from(beds)
    .where(and(eq(beds.roomNumber, roomNumber), eq(beds.bedNumber, bedNumber)))
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
        or(eq(beds.status, "available"), eq(beds.status, "cleaned")),
      ),
    )
    .orderBy(asc(beds.roomNumber));

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
        or(eq(beds.status, "reserved"), eq(beds.status, "occupied")),
      ),
    )
    .orderBy(asc(beds.roomNumber));

  return results;
}

/**
 * Get beds in maintenance
 */
export async function getBedsInMaintenance(): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(eq(beds.status, "maintenance"))
    .orderBy(asc(beds.roomNumber));

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
    .orderBy(asc(beds.roomNumber));

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
    .orderBy(asc(beds.bedNumber));

  return results;
}

/**
 * Search beds by room name
 */
export async function searchBeds(
  query: string,
  limit: number = 10,
): Promise<Bed[]> {
  const results = await db
    .select()
    .from(beds)
    .where(like(beds.roomName, `%${query}%`))
    .orderBy(asc(beds.roomNumber))
    .limit(limit);

  return results;
}

/**
 * Get bed statistics
 */
export async function getBedStats(): Promise<BedStats> {
  const [total] = await db.select({ count: count() }).from(beds);

  const [available] = await db
    .select({ count: count() })
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, true),
        or(eq(beds.status, "available"), eq(beds.status, "cleaned")),
      ),
    );

  const [occupied] = await db
    .select({ count: count() })
    .from(beds)
    .where(
      and(
        eq(beds.isAvailable, false),
        or(eq(beds.status, "reserved"), eq(beds.status, "occupied")),
      ),
    );

  const roomTypeStats = await db
    .select({
      roomType: beds.roomType,
      total: count(beds.id),
      available: count(
        and(
          eq(beds.isAvailable, true),
          or(eq(beds.status, "available"), eq(beds.status, "cleaned")),
        ),
      ),
    })
    .from(beds)
    .groupBy(beds.roomType);

  return {
    totalBeds: total?.count || 0,
    availableBeds: available?.count || 0,
    occupiedBeds: occupied?.count || 0,
    byRoomType: Object.fromEntries(
      roomTypeStats.map((s) => [
        s.roomType || "unknown",
        {
          total: s.total || 0,
          available: s.available || 0,
        },
      ]),
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
    .orderBy(desc(beds.createdAt))
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

  return results.map((r) => r.bed);
}

/**
 * Get all beds with their current occupant, if any.
 *
 * A bed is "occupied" (for this view) when it has a booking whose status is
 * still claiming the bed — reserved or checked in. Cancelled, expired,
 * checked-out, completed and deleted bookings never surface a guest here,
 * matching how `getActiveBookings` scopes "active".
 */
export async function getBedsWithGuestInfo(): Promise<BedWithGuest[]> {
  const results = await db
    .select({
      id: beds.id,
      bedNumber: beds.bedNumber,
      roomNumber: beds.roomNumber,
      roomName: beds.roomName,
      roomType: beds.roomType,
      status: beds.status,
      firstName: pilgrims.firstName,
      lastName1: pilgrims.lastName1,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
    })
    .from(beds)
    .leftJoin(
      bookings,
      and(
        eq(bookings.bedAssignmentId, beds.id),
        or(eq(bookings.status, "reserved"), eq(bookings.status, "checked_in")),
      ),
    )
    .leftJoin(pilgrims, eq(pilgrims.id, bookings.pilgrimId))
    .orderBy(asc(beds.roomNumber), asc(beds.bedNumber));

  return results.map((r) => ({
    id: r.id,
    bedNumber: r.bedNumber,
    roomNumber: r.roomNumber,
    roomName: r.roomName,
    roomType: r.roomType,
    status: r.status,
    guestName: r.firstName ? `${r.firstName} ${r.lastName1 ?? ""}`.trim() : null,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
  }));
}

/**
 * Get beds that will be available on a specific date
 */
export async function getBedsAvailableOnDate(date: Date): Promise<Bed[]> {
  // Column types differ deliberately: check_in_date/check_out_date are `date`
  // columns and compare as 'YYYY-MM-DD' strings; reservation_expires_at is a
  // `timestamp` and compares as a Date. Drizzle maps each to its wire type.
  const dateStr = date.toISOString().slice(0, 10);
  const now = new Date();
  const results = await db
    .select({ bed: beds })
    .from(beds)
    .leftJoin(
      bookings,
      and(
        eq(bookings.bedAssignmentId, beds.id),
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          gte(bookings.reservationExpiresAt, now),
        ),
        // Night of `dateStr` is occupied when checkIn <= dateStr <= checkOut
        lte(bookings.checkInDate, dateStr),
        gte(bookings.checkOutDate, dateStr),
      ),
    )
    // A joined row is an active overlapping reservation; no row means the bed
    // is free. (Joined rows always have bed_assignment_id = beds.id, so any
    // isNull(bedAssignmentId) branch would be dead code.)
    .where(isNull(bookings.id))
    .orderBy(asc(beds.roomNumber));

  return results.map((r) => r.bed);
}
