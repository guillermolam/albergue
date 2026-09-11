/**
 * Booking Queries
 * Read operations for bookings
 */

import { db } from '../lib/db';
import { bookings, pilgrims, beds, payments } from '../../domain_model/schema';
import { eq, and, or, isNull, like, count, sum, desc, asc, gte, lte, between } from 'drizzle-orm';
import type { Booking, Bed } from '../types';
import type { PaginatedResponse, PaginationParams, BookingFilter } from '../types';

/**
 * Get all bookings with pagination
 */
export async function getAllBookings(
  params: PaginationParams & BookingFilter = {}
): Promise<PaginatedResponse<Booking>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = 'createdAt',
    orderDirection = 'desc',
    status,
    checkInDateFrom,
    checkInDateTo,
    pilgrimId,
    roomType,
  } = params;

  const offset = (page - 1) * pageSize;
  const order = orderDirection === 'asc' ? asc : desc;

  // Build where conditions
  const whereConditions = [];
  
  if (status) {
    whereConditions.push(eq(bookings.status, status));
  }
  
  if (checkInDateFrom) {
    whereConditions.push(
      // @ts-ignore
      gte(bookings.checkInDate, new Date(checkInDateFrom))
    );
  }
  
  if (checkInDateTo) {
    whereConditions.push(
      // @ts-ignore
      lte(bookings.checkInDate, new Date(checkInDateTo))
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
    .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id));

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
      // @ts-ignore
      orderBy in bookings ? bookings[orderBy] : bookings.createdAt,
      order
    )
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: results.map(r => r.booking),
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
export async function getBookingByReference(referenceNumber: string): Promise<Booking | null> {
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
export async function getBookingsByPilgrim(pilgrimId: number): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .where(eq(bookings.pilgrimId, pilgrimId))
    .orderBy(bookings.createdAt, desc);
  
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
        eq(bookings.status, 'reserved'),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, now)
        )
      )
    )
    .orderBy(bookings.checkInDate, asc);
  
  return results;
}

/**
 * Get bookings by date range
 */
export async function getBookingsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .where(
      and(
        // @ts-ignore
        gte(bookings.checkInDate, startDate),
        // @ts-ignore
        lte(bookings.checkInDate, endDate)
      )
    )
    .orderBy(bookings.checkInDate, asc);
  
  return results;
}

/**
 * Get upcoming check-ins
 */
export async function getUpcomingCheckIns(days: number = 7): Promise<Booking[]> {
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
        eq(bookings.status, 'reserved')
      )
    )
    .orderBy(bookings.checkInDate, asc);
  
  return results.map(r => r.booking);
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
        eq(bookings.status, 'reserved'),
        // @ts-ignore
        lte(bookings.reservationExpiresAt, now)
      )
    )
    .orderBy(bookings.reservationExpiresAt, asc);
  
  return results.map(r => r.booking);
}

/**
 * Get booking statistics
 */
export async function getBookingStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Total bookings
  const [total] = await db
    .select({ count: count() })
    .from(bookings);
  
  // Active bookings
  const [active] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, 'reserved'),
        or(
          isNull(bookings.reservationExpiresAt),
          // @ts-ignore
          gte(bookings.reservationExpiresAt, now)
        )
      )
    );
  
  // Completed bookings
  const [completed] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, 'completed'));
  
  // Cancelled bookings
  const [cancelled] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, 'cancelled'));
  
  // Total revenue
  const [revenue] = await db
    .select({ total: sum(bookings.totalAmount) })
    .from(bookings)
    .where(
      or(
        eq(bookings.status, 'completed'),
        eq(bookings.status, 'reserved')
      )
    );
  
  // Average stay
  const [avgStay] = await db
    .select({ avg: avg(bookings.numberOfNights) })
    // @ts-ignore
    .from(bookings);
  
  // Monthly bookings
  const [monthly] = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      // @ts-ignore
      gte(bookings.createdAt, startOfMonth)
    );
  
  // Bed occupancy by room type
  const roomTypeStats = await db
    .select({
      roomType: beds.roomType,
      occupied: count(bookings.id),
      total: count(beds.id),
    })
    .from(beds)
    .leftJoin(bookings, and(
      eq(bookings.bedAssignmentId, beds.id),
      eq(bookings.status, 'reserved'),
      or(
        isNull(bookings.reservationExpiresAt),
        // @ts-ignore
        gte(bookings.reservationExpiresAt, now)
      )
    ))
    .groupBy(beds.roomType);
  
  return {
    totalBookings: total?.count || 0,
    activeBookings: active?.count || 0,
    completedBookings: completed?.count || 0,
    cancelledBookings: cancelled?.count || 0,
    totalRevenue: revenue?.total || '0',
    averageStay: avgStay?.avg ? Math.round(parseFloat(String(avgStay.avg)) * 100) / 100 : 0,
    monthlyBookings: monthly?.count || 0,
    byRoomType: roomTypeStats.map(s => ({
      roomType: s.roomType || 'unknown',
      occupied: s.occupied || 0,
      total: s.total || 0,
      occupancyRate: s.total > 0 ? Math.round((s.occupied / s.total) * 100) : 0,
    })),
  };
}

/**
 * Get recent bookings
 */
export async function getRecentBookings(limit: number = 10): Promise<Booking[]> {
  const results = await db
    .select()
    .from(bookings)
    .orderBy(bookings.createdAt, desc)
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
export async function searchBookings(query: string, limit: number = 10): Promise<Booking[]> {
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
        like(pilgrims.lastName2, `%${query}%`)
      )
    )
    .orderBy(bookings.createdAt, desc)
    .limit(limit);
  
  return results.map(r => r.booking);
}

/**
 * Get available beds for booking
 */
export async function getAvailableBedsForDates(
  checkInDate: Date,
  checkOutDate: Date,
  roomType?: string
): Promise<Bed[]> {
  // Find beds that are not reserved during the date range
  const results = await db
    .select({
      bed: beds,
      hasBooking: count(bookings.id).gt(0),
    })
    .from(beds)
    .leftJoin(bookings, and(
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
          lte(bookings.checkInDate, checkOutDate),
          gte(bookings.checkOutDate, checkInDate)
        )
      )
    ))
    .groupBy(beds.id)
    .having(count(bookings.id).eq(0))
    .orderBy(beds.roomNumber, asc);
  
  return results
    .filter(r => roomType ? r.bed.roomType === roomType : true)
    .map(r => r.bed);
}

// Helper for average
function avg(column: any) {
  return { avg: sql`AVG(${column})` };
}
