/**
 * Booking Queries
 * Read operations for bookings
 */

import { db } from "../lib/db.js";
import { bookings, pilgrims, beds, payments } from "@albergue/domain-model";
import {
  eq,
  and,
  or,
  isNull,
  like,
  count,
  sum,
  desc,
  asc,
  gte,
  lte,
  between,
  gt,
  sql,
} from "drizzle-orm";
import type { Booking, Bed } from "../types/index.js";
import type {
  PaginatedResponse,
  PaginationParams,
  BookingFilter,
} from "../types/index.js";

/**
 * Get all bookings with pagination
 */
export async function getAllBookings(
  params: PaginationParams & BookingFilter = {},
): Promise<PaginatedResponse<Booking>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = "createdAt",
    orderDirection = "desc",
    status,
    checkInDateFrom,
    checkInDateTo,
    pilgrimId,
    roomType,
  } = params;

  const offset = (page - 1) * pageSize;
  const orderFn = orderDirection === "asc" ? asc : desc;

  // Build where conditions
  const whereConditions = [];

  if (status) {
    whereConditions.push(eq(bookings.status, status));
  }

  if (checkInDateFrom) {
    whereConditions.push(
      // @ts-ignore
      gte(bookings.checkInDate, new Date(checkInDateFrom)),
    );
  }

  if (checkInDateTo) {
    whereConditions.push(
      // @ts-ignore
      lte(bookings.checkInDate, new Date(checkInDateTo)),
    );
  }

  if (pilgrimId) {
    whereConditions.push(eq(bookings.pilgrimId, pilgrimId));
  }

  // Join for roomType filtering
  let query = db
    .select({
      booking: bookings,
      pilgrim: {
        id: pilgrims.id,
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        email: pilgrims.email,
        phone: pilgrims.phone,
      },
      bed: {
        id: beds.id,
        bedNumber: beds.bedNumber,
        roomNumber: beds.roomNumber,
        roomName: beds.roomName,
        roomType: beds.roomType,
      },
    })
    .from(bookings)
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id))
    .$dynamic();

  if (roomType) {
    whereConditions.push(eq(beds.roomType, roomType));
  }

  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions));
  }

  // Get total count
  const countQuery = db
    .select({ count: count() })
    .from(bookings)
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id));

  if (whereConditions.length > 0) {
    // @ts-ignore
    countQuery.where(and(...whereConditions));
  }

  const [countResult] = await countQuery;
  const total = countResult?.count || 0;

  // Get paginated results
  const results = await query
    .orderBy(
      orderFn(
        orderBy in bookings ? (bookings as any)[orderBy] : bookings.createdAt,
      ),
    )
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: results.map((r) => r.booking),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: number): Promise<Booking | null> {
  const [result] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);

  return result || null;
}

/**
 * Get booking by reference number
 */
export async function getBookingByReference(
  referenceNumber: string,
): Promise<Booking | null> {
  const [result] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.referenceNumber, referenceNumber))
    .limit(1);

  return result || null;
}

/**
 * Get bookings for a pilgrim
 */
export async function getBookingsByPilgrim(
  pilgrimId: number,
): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .where(eq(bookings.pilgrimId, pilgrimId))
    .orderBy(desc(bookings.createdAt));

  return results;
}

/**
 * Get active bookings
 */
export async function getActiveBookings(): Promise<Booking[]> {
  const now = new Date();

  const results = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, now),
        ),
      ),
    )
    .orderBy(asc(bookings.checkInDate));

  return results;
}

/**
 * Get bookings by date range
 */
export async function getBookingsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .where(
      and(
        // @ts-ignore
        gte(bookings.checkInDate, startDate),
        // @ts-ignore
        lte(bookings.checkInDate, endDate),
      ),
    )
    .orderBy(asc(bookings.checkInDate));

  return results;
}

/**
 * Get upcoming check-ins
 */
export async function getUpcomingCheckIns(
  days: number = 7,
): Promise<Booking[]> {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const results = await db
    .select({
      booking: bookings,
      pilgrim: {
        id: pilgrims.id,
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        phone: pilgrims.phone,
        email: pilgrims.email,
      },
    })
    .from(bookings)
    .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      and(
        // @ts-ignore
        between(bookings.checkInDate, today, endDate),
        eq(bookings.status, "reserved"),
      ),
    )
    .orderBy(asc(bookings.checkInDate));

  return results.map((r) => r.booking);
}

/**
 * Get overdue reservations
 */
export async function getOverdueReservations(): Promise<Booking[]> {
  const now = new Date();

  const results = await db
    .select({
      booking: bookings,
      pilgrim: {
        id: pilgrims.id,
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        email: pilgrims.email,
        phone: pilgrims.phone,
      },
    })
    .from(bookings)
    .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      and(
        eq(bookings.status, "reserved"),
        // @ts-ignore
        lte(bookings.reservationExpiresAt, now),
      ),
    )
    .orderBy(asc(bookings.reservationExpiresAt));

  return results.map((r) => r.booking);
}

/**
 * Get booking statistics
 */
export async function getBookingStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total bookings
  const [total] = await db.select({ count: count() }).from(bookings);

  // Active bookings
  const [active] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, now),
        ),
      ),
    );

  // Completed bookings
  const [completed] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, "completed"));

  // Cancelled bookings
  const [cancelled] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, "cancelled"));

  // Total revenue
  const [revenue] = await db
    .select({ total: sum(bookings.totalAmount) })
    .from(bookings)
    .where(
      or(eq(bookings.status, "completed"), eq(bookings.status, "reserved")),
    );

  // Average stay
  const [avgStay] = await db
    .select({ avg: avg(bookings.numberOfNights) })
    // @ts-ignore
    .from(bookings);

  // Monthly bookings
  const [monthly] = await db.select({ count: count() }).from(bookings).where(
    // @ts-ignore
    gte(bookings.createdAt, startOfMonth),
  );

  // Bed occupancy by room type
  const roomTypeStats = await db
    .select({
      roomType: beds.roomType,
      occupied: count(bookings.id),
      total: count(beds.id),
    })
    .from(beds)
    .leftJoin(
      bookings,
      and(
        eq(bookings.bedAssignmentId, beds.id),
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, now),
        ),
      ),
    )
    .groupBy(beds.roomType);

  const byRoomType = roomTypeStats.map((s) => ({
    roomType: s.roomType || "unknown",
    occupied: s.occupied || 0,
    total: s.total || 0,
    occupancyRate: s.total > 0 ? Math.round((s.occupied / s.total) * 100) : 0,
  }));

  const occupiedBeds = byRoomType.reduce((sum, s) => sum + s.occupied, 0);
  const totalBeds = byRoomType.reduce((sum, s) => sum + s.total, 0);

  return {
    totalBookings: total?.count || 0,
    activeBookings: active?.count || 0,
    completedBookings: completed?.count || 0,
    cancelledBookings: cancelled?.count || 0,
    totalRevenue: revenue?.total || "0",
    averageStay: avgStay?.avg
      ? Math.round(parseFloat(String(avgStay.avg)) * 100) / 100
      : 0,
    occupancyRate:
      totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    monthlyBookings: monthly?.count || 0,
    byRoomType,
  };
}

/**
 * Get bookings-per-day and revenue-per-day for the last 7 days (including
 * today), for the admin dashboard's weekly charts. Days with no bookings
 * are filled with zero rather than omitted, so the chart's x-axis is stable.
 */
export async function getWeeklyBookingStats(): Promise<
  Array<{ day: string; bookings: number; revenue: number }>
> {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const dayExpr = sql<string>`to_char(${bookings.createdAt}, 'YYYY-MM-DD')`;
  const rows = await db
    .select({
      day: dayExpr,
      bookingCount: count(),
      revenue: sum(bookings.totalAmount),
    })
    .from(bookings)
    .where(gte(bookings.createdAt, since))
    .groupBy(dayExpr);

  const byDay = new Map(rows.map((r) => [r.day, r]));
  const result: Array<{ day: string; bookings: number; revenue: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = byDay.get(key);
    result.push({
      day: key,
      bookings: row?.bookingCount ?? 0,
      revenue: row?.revenue ? parseFloat(String(row.revenue)) : 0,
    });
  }
  return result;
}

/**
 * Get recent bookings with guest name and bed label, for the admin
 * dashboard's recent-bookings table (getRecentBookings() alone only
 * returns raw booking rows, with no pilgrim/bed identity attached).
 */
export async function getRecentBookingsWithDetails(limit: number = 5): Promise<
  Array<{
    id: number;
    referenceNumber: string;
    guestName: string;
    bedLabel: string | null;
    checkInDate: string;
    status: string | null;
  }>
> {
  const results = await db
    .select({
      id: bookings.id,
      referenceNumber: bookings.referenceNumber,
      checkInDate: bookings.checkInDate,
      status: bookings.status,
      firstName: pilgrims.firstName,
      lastName1: pilgrims.lastName1,
      roomName: beds.roomName,
      bedNumber: beds.bedNumber,
    })
    .from(bookings)
    .innerJoin(pilgrims, eq(pilgrims.id, bookings.pilgrimId))
    .leftJoin(beds, eq(beds.id, bookings.bedAssignmentId))
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  return results.map((r) => ({
    id: r.id,
    referenceNumber: r.referenceNumber,
    guestName: `${r.firstName} ${r.lastName1}`.trim(),
    bedLabel: r.roomName ? `${r.roomName}-B${r.bedNumber}` : null,
    checkInDate: r.checkInDate,
    status: r.status,
  }));
}

/**
 * Get recent bookings
 */
export async function getRecentBookings(
  limit: number = 10,
): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  return results;
}

/**
 * Get booking with full details
 */
export async function getBookingWithDetails(id: number) {
  const [result] = await db
    .select({
      booking: bookings,
      pilgrim: pilgrims,
      bed: beds,
      payment: payments,
    })
    .from(bookings)
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id))
    .leftJoin(payments, eq(payments.bookingId, bookings.id))
    .where(eq(bookings.id, id))
    .limit(1);

  return result || null;
}

/**
 * Search bookings
 */
export async function searchBookings(
  query: string,
  limit: number = 10,
): Promise<Booking[]> {
  const results = await db
    .select({
      booking: bookings,
      pilgrim: {
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        lastName2: pilgrims.lastName2,
      },
    })
    .from(bookings)
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      or(
        like(bookings.referenceNumber, `%${query}%`),
        like(pilgrims.firstName, `%${query}%`),
        like(pilgrims.lastName1, `%${query}%`),
        like(pilgrims.lastName2, `%${query}%`),
      ),
    )
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  return results.map((r) => r.booking);
}

/**
 * Get available beds for booking
 */
export async function getAvailableBedsForDates(
  checkInDate: Date,
  checkOutDate: Date,
  roomType?: string,
): Promise<Bed[]> {
  const checkInStr = checkInDate.toISOString().slice(0, 10);
  const checkOutStr = checkOutDate.toISOString().slice(0, 10);
  // Find beds that are not reserved during the date range
  const results = await db
    .select({
      bed: beds,
      hasBooking: gt(count(bookings.id), 0),
    })
    .from(beds)
    .leftJoin(
      bookings,
      and(
        eq(bookings.bedAssignmentId, beds.id),
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          gte(bookings.reservationExpiresAt, new Date()),
        ),
        // Check for date overlap
        or(
          and(
            lte(bookings.checkInDate, checkOutStr),
            gte(bookings.checkOutDate, checkInStr),
          ),
        ),
      ),
    )
    .groupBy(beds.id)
    .having(eq(count(bookings.id), 0))
    .orderBy(asc(beds.roomNumber));

  return results
    .filter((r) => (roomType ? r.bed.roomType === roomType : true))
    .map((r) => r.bed);
}

// Helper for average
function avg(column: any) {
  return sql`AVG(${column})`;
}
