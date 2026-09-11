import { db } from '../lib/db';
import { bookings, beds, pilgrims, payments } from '../../schema';
import { eq, and, or, like, desc, asc, isNull, not, between, lt, gt, gte, lte } from 'drizzle-orm';
import { DatabaseError, NotFoundError, withDbRetry } from '../lib/errors';
import type { Booking } from '../../schema';
import type { PaginatedResult } from './pilgrims';

/**
 * Query options for bookings
 */
export interface BookingQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string | string[];
  checkInFrom?: Date;
  checkInTo?: Date;
  checkOutFrom?: Date;
  checkOutTo?: Date;
  pilgrimId?: number;
  bedId?: number;
  sortBy?: 'id' | 'checkInDate' | 'checkOutDate' | 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
  includeCancelled?: boolean;
  includeExpired?: boolean;
}

/**
 * Query: Get a single booking by ID
 */
export async function getBookingById(id: number): Promise<Booking | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);

      return result || null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get booking ${id}`,
        error as Error,
        'SELECT bookings WHERE id = $1',
        { id },
      );
    }
  });
}

/**
 * Query: Get a booking by ID or throw
 */
export async function getBookingByIdOrThrow(id: number): Promise<Booking> {
  const booking = await getBookingById(id);
  if (!booking) {
    throw new NotFoundError('Booking', id);
  }
  return booking;
}

/**
 * Query: Get booking by reference number
 */
export async function getBookingByReference(referenceNumber: string): Promise<Booking | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.referenceNumber, referenceNumber))
        .limit(1);

      return result || null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get booking by reference ${referenceNumber}`,
        error as Error,
        'SELECT bookings WHERE reference_number = $1',
        { referenceNumber },
      );
    }
  });
}

/**
 * Query: Get all bookings with pagination and filtering
 */
export async function getBookings(options: BookingQueryOptions = {}): Promise<PaginatedResult<Booking>> {
  return withDbRetry(async () => {
    try {
      const {
        page = 1,
        pageSize = 20,
        search,
        status,
        checkInFrom,
        checkInTo,
        checkOutFrom,
        checkOutTo,
        pilgrimId,
        bedId,
        sortBy = 'checkInDate',
        sortOrder = 'desc',
        includeCancelled = false,
        includeExpired = false,
      } = options;

      const offset = (page - 1) * pageSize;

      // Base where conditions
      const whereConditions = [];

      // Search filter
      if (search) {
        const searchPattern = `%${search}%`;
        whereConditions.push(
          or(
            like(bookings.referenceNumber, searchPattern),
            like(bookings.notes, searchPattern),
          ),
        );
      }

      // Status filter
      if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        whereConditions.push(or(...statuses.map(s => eq(bookings.status, s))));
      }

      // Date filters
      if (checkInFrom) {
        whereConditions.push(gte(bookings.checkInDate, checkInFrom));
      }
      if (checkInTo) {
        whereConditions.push(lte(bookings.checkInDate, checkInTo));
      }
      if (checkOutFrom) {
        whereConditions.push(gte(bookings.checkOutDate, checkOutFrom));
      }
      if (checkOutTo) {
        whereConditions.push(lte(bookings.checkOutDate, checkOutTo));
      }

      // Pilgrim filter
      if (pilgrimId) {
        whereConditions.push(eq(bookings.pilgrimId, pilgrimId));
      }

      // Bed filter
      if (bedId) {
        whereConditions.push(eq(bookings.bedAssignmentId, bedId));
      }

      // Exclude cancelled if not included
      if (!includeCancelled) {
        whereConditions.push(ne(bookings.status, 'cancelled'));
      }

      // Exclude expired if not included
      if (!includeExpired) {
        whereConditions.push(ne(bookings.status, 'expired'));
      }

      // Build the where clause
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Sort order mapping
      const sortField = {
        id: bookings.id,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        createdAt: bookings.createdAt,
        totalAmount: bookings.totalAmount,
      }[sortBy] || bookings.checkInDate;

      const orderBy = sortOrder === 'asc' ? asc(sortField) : desc(sortField);

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(bookings)
        .where(whereClause);

      const total = Number(countResult?.count || 0);

      // Get paginated data
      const data = await db
        .select()
        .from(bookings)
        .where(whereClause)
        .orderBy(orderBy)
        .offset(offset)
        .limit(pageSize);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get bookings',
        error as Error,
        'SELECT bookings WITH filters',
        options,
      );
    }
  });
}

// Helper for count
function count() {
  return 'count' as any;
}

// Helper for ne
function ne(column: any, value: any) {
  return not(eq(column, value));
}

/**
 * Query: Get today's arrivals
 */
export async function getTodaysArrivals(): Promise<Array<Booking & { pilgrim: any; bed?: any }>> {
  return withDbRetry(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = await db
        .select({
          booking: bookings,
          pilgrim: pilgrims,
          bed: beds,
        })
        .from(bookings)
        .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
        .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id))
        .where(
          and(
            eq(bookings.checkInDate, today),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        )
        .orderBy(bookings.estimatedArrivalTime, bookings.referenceNumber);

      return result.map(r => ({
        ...r.booking,
        pilgrim: r.pilgrim,
        bed: r.bed,
      }));
    } catch (error) {
      throw new DatabaseError(
        'Failed to get today arrivals',
        error as Error,
        'SELECT bookings JOIN pilgrims WHERE check_in_date = TODAY',
      );
    }
  });
}

/**
 * Query: Get today's departures
 */
export async function getTodaysDepartures(): Promise<Array<Booking & { pilgrim: any; bed?: any }>> {
  return withDbRetry(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await db
        .select({
          booking: bookings,
          pilgrim: pilgrims,
          bed: beds,
        })
        .from(bookings)
        .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
        .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id))
        .where(
          and(
            eq(bookings.checkOutDate, today),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        )
        .orderBy(bookings.referenceNumber);

      return result.map(r => ({
        ...r.booking,
        pilgrim: r.pilgrim,
        bed: r.bed,
      }));
    } catch (error) {
      throw new DatabaseError(
        'Failed to get today departures',
        error as Error,
        'SELECT bookings JOIN pilgrims WHERE check_out_date = TODAY',
      );
    }
  });
}

/**
 * Query: Get current occupancy (checked in but not checked out)
 */
export async function getCurrentOccupancy(): Promise<Array<Booking & { pilgrim: any; bed?: any }>> {
  return withDbRetry(async () => {
    try {
      const now = new Date();

      const result = await db
        .select({
          booking: bookings,
          pilgrim: pilgrims,
          bed: beds,
        })
        .from(bookings)
        .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
        .leftJoin(beds, eq(bookings.bedAssignmentId, beds.id))
        .where(
          and(
            eq(bookings.status, 'checked_in'),
            lte(bookings.checkInDate, now),
            gte(bookings.checkOutDate, now),
          ),
        )
        .orderBy(bookings.checkInDate, bookings.referenceNumber);

      return result.map(r => ({
        ...r.booking,
        pilgrim: r.pilgrim,
        bed: r.bed,
      }));
    } catch (error) {
      throw new DatabaseError(
        'Failed to get current occupancy',
        error as Error,
        'SELECT bookings JOIN pilgrims WHERE status = checked_in AND dates overlap NOW()',
      );
    }
  });
}

/**
 * Query: Get bookings that need payment follow-up
 */
export async function getBookingsNeedingPayment(): Promise<Booking[]> {
  return withDbRetry(async () => {
    try {
      const now = new Date();

      const result = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.paymentStatus, 'awaiting_payment'),
            lte(bookings.paymentDeadline, now),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        )
        .orderBy(bookings.paymentDeadline);

      return result;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get bookings needing payment',
        error as Error,
        'SELECT bookings WHERE payment_status = awaiting_payment AND payment_deadline < NOW()',
      );
    }
  });
}

/**
 * Query: Get reservations that will expire soon
 */
export async function getExpiringReservations(hours: number = 24): Promise<Booking[]> {
  return withDbRetry(async () => {
    try {
      const now = new Date();
      const expiryThreshold = new Date(now.getTime() + hours * 60 * 60 * 1000);

      const result = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.status, 'reserved'),
            between(bookings.reservationExpiresAt, now, expiryThreshold),
          ),
        )
        .orderBy(bookings.reservationExpiresAt);

      return result;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get expiring reservations`,
        error as Error,
        'SELECT bookings WHERE status = reserved AND reservation_expires_at BETWEEN NOW AND NOW + $1 hours',
        { hours },
      );
    }
  });
}

/**
 * Query: Get booking statistics
 */
export async function getBookingStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byRoomType: Record<string, number>;
  todayArrivals: number;
  todayDepartures: number;
  currentOccupancy: number;
  totalBeds: number;
  availableBeds: number;
  upcoming: number;
}> {
  return withDbRetry(async () => {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Total bookings
      const [totalResult] = await db
        .select({ count: count() })
        .from(bookings);
      const total = Number(totalResult?.count || 0);

      // By status
      const statusResult = await db
        .select({
          status: bookings.status,
          count: count(),
        })
        .from(bookings)
        .groupBy(bookings.status);

      const byStatus: Record<string, number> = {};
      for (const row of statusResult) {
        byStatus[row.status || 'Unknown'] = Number(row.count);
      }

      // By room type
      const roomTypeResult = await db
        .select({
          roomType: beds.roomType,
          count: count(),
        })
        .from(bookings)
        .innerJoin(beds, eq(bookings.bedAssignmentId, beds.id))
        .where(not(isNull(bookings.bedAssignmentId)))
        .groupBy(beds.roomType);

      const byRoomType: Record<string, number> = {};
      for (const row of roomTypeResult) {
        byRoomType[row.roomType || 'Unknown'] = Number(row.count);
      }

      // Today's arrivals
      const [todayArrivalsResult] = await db
        .select({ count: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.checkInDate, now),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        );
      const todayArrivals = Number(todayArrivalsResult?.count || 0);

      // Today's departures
      const [todayDeparturesResult] = await db
        .select({ count: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.checkOutDate, now),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        );
      const todayDepartures = Number(todayDeparturesResult?.count || 0);

      // Current occupancy
      const [currentOccupancyResult] = await db
        .select({ count: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.status, 'checked_in'),
            lte(bookings.checkInDate, new Date()),
            gte(bookings.checkOutDate, new Date()),
          ),
        );
      const currentOccupancy = Number(currentOccupancyResult?.count || 0);

      // Total beds
      const [totalBedsResult] = await db
        .select({ count: count() })
        .from(beds);
      const totalBeds = Number(totalBedsResult?.count || 0);

      // Available beds
      const [availableBedsResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(eq(beds.isAvailable, true));
      const availableBeds = Number(availableBedsResult?.count || 0);

      // Upcoming bookings (next 7 days)
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const [upcomingResult] = await db
        .select({ count: count() })
        .from(bookings)
        .where(
          and(
            gte(bookings.checkInDate, now),
            lte(bookings.checkInDate, nextWeek),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        );
      const upcoming = Number(upcomingResult?.count || 0);

      return {
        total,
        byStatus,
        byRoomType,
        todayArrivals,
        todayDepartures,
        currentOccupancy,
        totalBeds,
        availableBeds,
        upcoming,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get booking statistics',
        error as Error,
        'SELECT bookings STATS',
      );
    }
  });
}

/**
 * Query: Get calendar view of bookings for a date range
 */
export async function getBookingCalendar(
  startDate: Date,
  endDate: Date,
): Promise<Array<{
  date: Date;
  arrivals: Booking[];
  departures: Booking[];
  occupancy: number;
}>> {
  return withDbRetry(async () => {
    try {
      const calendar: Array<{
        date: Date;
        arrivals: Booking[];
        departures: Booking[];
        occupancy: number;
      }> = [];

      const currentDate = new Date(startDate);
      const loopEnd = new Date(endDate);

      while (currentDate <= loopEnd) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Get arrivals for this date
        const arrivals = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.checkInDate, currentDate),
              not(eq(bookings.status, 'cancelled')),
              not(eq(bookings.status, 'no_show')),
            ),
          )
          .orderBy(bookings.estimatedArrivalTime);

        // Get departures for this date
        const departures = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.checkOutDate, currentDate),
              not(eq(bookings.status, 'cancelled')),
              not(eq(bookings.status, 'no_show')),
            ),
          )
          .orderBy(bookings.referenceNumber);

        // Calculate occupancy for this date
        const [occupancyResult] = await db
          .select({ count: count() })
          .from(bookings)
          .where(
            and(
              lte(bookings.checkInDate, currentDate),
              gt(bookings.checkOutDate, currentDate),
              not(eq(bookings.status, 'cancelled')),
              not(eq(bookings.status, 'no_show')),
            ),
          );

        const occupancy = Number(occupancyResult?.count || 0);

        calendar.push({
          date: new Date(currentDate),
          arrivals,
          departures,
          occupancy,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return calendar;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get booking calendar',
        error as Error,
        'SELECT bookings CALENDAR',
        { startDate, endDate },
      );
    }
  });
}
