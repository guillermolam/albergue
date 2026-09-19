/**
 * Booking Routes
 * API endpoints for bookings
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import { authMiddleware } from '../lib/middleware.js';
import {
  getAllBookings,
  getBookingById,
  getBookingByReference,
  getBookingsByPilgrim,
  getActiveBookings,
  getBookingsByDateRange,
  getUpcomingCheckIns,
  getOverdueReservations,
  getBookingStats,
  getRecentBookings,
  getBookingWithDetails,
  searchBookings,
  getAvailableBedsForDates,
} from '../queries/bookings.js';
import { createBooking, updateBookingStatus } from '../commands/bookings.js';
import { computeBookingQuote } from '../queries/pricing.js';
import { randomBytes } from 'node:crypto';
import {
  BOOKING_STATUSES,
  type CreateBookingRequest,
  type UpdateBookingStatusRequest,
  type BookingQuoteRequest,
  type BookingQuote,
} from '@albergue/api-contract';
import type {
  Booking,
  ApiResponse,
  PaginatedResponse,
  BookingFilter,
  BookingStats,
} from '../types/index.js';

const bookings = new Hono();

/**
 * GET /bookings - Get all bookings with optional filters
 */
bookings.get('/', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { page, pageSize, orderBy, orderDirection, ...filters } = c.req.query();
    
    const params = {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orderBy: orderBy as string,
      orderDirection: orderDirection as 'asc' | 'desc',
      ...filters,
    };

    const result = await getAllBookings(params as any);
    
    return c.json<ApiResponse<PaginatedResponse<Booking>>>({
      success: true,
      data: result,
      message: 'Bookings retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get bookings: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/reference/:reference - Get booking by reference number
 */
// Public: this is how a guest looks up their own booking confirmation by
// reference number (the reference itself is the access credential).
bookings.get('/reference/:reference', async (c: Context) => {
  try {
    const reference = c.req.param('reference');
    if (!reference) {
      throw new HTTPException(400, { message: 'reference is required' });
    }
    const booking = await getBookingByReference(reference);
    
    if (!booking) {
      throw new HTTPException(404, { message: 'Booking not found' });
    }

    return c.json<ApiResponse<Booking>>({
      success: true,
      data: booking,
      message: 'Booking retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get booking: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/pilgrim/:pilgrimId - Get bookings by pilgrim ID
 */
bookings.get('/pilgrim/:pilgrimId', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const pilgrimId = Number(c.req.param('pilgrimId'));
    
    if (isNaN(pilgrimId)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const bookings = await getBookingsByPilgrim(pilgrimId);
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Bookings retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get bookings: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/active - Get active bookings
 */
bookings.get('/active', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const bookings = await getActiveBookings();
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Active bookings retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get active bookings: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/upcoming - Get upcoming check-ins
 */
bookings.get('/upcoming', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { days } = c.req.query();
    const daysNum = days ? Number(days) : 7;
    
    const bookings = await getUpcomingCheckIns(daysNum);
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Upcoming check-ins retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get upcoming check-ins: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/overdue - Get overdue reservations
 */
bookings.get('/overdue', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const bookings = await getOverdueReservations();
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Overdue reservations retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get overdue reservations: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/stats - Get booking statistics
 */
bookings.get('/stats', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const stats = await getBookingStats();
    
    return c.json<ApiResponse<BookingStats>>({
      success: true,
      data: stats,
      message: 'Booking statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get booking statistics: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/recent - Get recent bookings
 */
bookings.get('/recent', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { limit } = c.req.query();
    const limitNum = limit ? Number(limit) : 10;
    
    const bookings = await getRecentBookings(limitNum);
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Recent bookings retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get recent bookings: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/search - Search bookings
 */
bookings.get('/search', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { q, limit } = c.req.query();
    const query = q as string || '';
    const limitNum = limit ? Number(limit) : 10;
    
    const results = await searchBookings(query, limitNum);
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: results,
      message: 'Bookings search completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to search bookings: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/available-beds - Get available beds for date range
 */
// Public: guests need to see availability before they can start a booking.
bookings.get('/available-beds', async (c: Context) => {
  try {
    const { checkInDate, checkOutDate, roomType } = c.req.query();
    
    if (!checkInDate || !checkOutDate) {
      throw new HTTPException(400, { message: 'checkInDate and checkOutDate are required' });
    }

    const beds = await getAvailableBedsForDates(
      new Date(checkInDate as string),
      new Date(checkOutDate as string),
      roomType as string
    );
    
    return c.json<ApiResponse<any>>({
      success: true,
      data: beds,
      message: 'Available beds retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get available beds: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/date-range - Get bookings by date range
 */
bookings.get('/date-range', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { startDate, endDate } = c.req.query();
    
    if (!startDate || !endDate) {
      throw new HTTPException(400, { message: 'startDate and endDate are required' });
    }

    const bookings = await getBookingsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    
    return c.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
      message: 'Bookings by date range retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get bookings by date range: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/:id - Get booking by ID
 * Registered after every static-segment GET route above: Hono matches
 * routes in registration order, and this single-segment wildcard would
 * otherwise shadow static paths like /available-beds or /stats.
 */
bookings.get('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid booking ID' });
    }

    const booking = await getBookingById(id);

    if (!booking) {
      throw new HTTPException(404, { message: 'Booking not found' });
    }

    return c.json<ApiResponse<Booking>>({
      success: true,
      data: booking,
      message: 'Booking retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get booking: ${String(error)}`,
    });
  }
});

/**
 * GET /bookings/:id/details - Get booking with full details
 */
bookings.get('/:id/details', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    
    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid booking ID' });
    }

    const details = await getBookingWithDetails(id);
    
    if (!details) {
      throw new HTTPException(404, { message: 'Booking not found' });
    }

    return c.json<ApiResponse<any>>({
      success: true,
      data: details,
      message: 'Booking details retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get booking details: ${String(error)}`,
    });
  }
});

/** Parse an ISO 8601 wire value into a Date, or throw a 400. */
function parseIsoDate(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HTTPException(400, { message: `Invalid ${field}: expected ISO 8601 datetime` });
  }
  return date;
}

/**
 * POST /bookings - Create a booking (transactional; claims bedId atomically)
 * Public: this is the guest booking-creation step of the booking flow.
 */
bookings.post('/', async (c: Context) => {
  try {
    const body = await c.req.json<CreateBookingRequest>();

    if (!body.pilgrimId || !body.checkInDate || !body.checkOutDate) {
      throw new HTTPException(400, {
        message: 'Missing required fields: pilgrimId, checkInDate, checkOutDate',
      });
    }

    const now = Date.now();
    const checkIn = parseIsoDate(body.checkInDate, 'checkInDate');
    const checkOut = parseIsoDate(body.checkOutDate, 'checkOutDate');
    let numberOfNights = Math.round((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));
    if (numberOfNights < 1) {
      throw new HTTPException(400, { message: 'checkOutDate must be after checkInDate' });
    }

    // BOOK-001: the server recomputes price/nights from the bed row; the
    // browser-posted totalAmount is an estimate and is never trusted.
    // totalAmount is required only for bed-less staff bookings.
    let totalAmount: string;
    if (body.bedId) {
      const quote = await computeBookingQuote(body.bedId, body.checkInDate, body.checkOutDate);
      if (!quote) throw new HTTPException(404, { message: 'Bed not found' });
      numberOfNights = quote.numberOfNights;
      totalAmount = quote.totalAmount;
    } else {
      if (!body.totalAmount) {
        throw new HTTPException(400, {
          message: 'totalAmount is required when no bedId is provided',
        });
      }
      totalAmount = body.totalAmount;
    }

    const booking = await createBooking({
      pilgrimId: body.pilgrimId,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      numberOfNights,
      numberOfPersons: body.numberOfPersons,
      numberOfRooms: body.numberOfRooms,
      hasInternet: body.hasInternet,
      estimatedArrivalTime: body.estimatedArrivalTime,
      notes: body.notes,
      bedAssignmentId: body.bedId,
      totalAmount,
      // BOOK-005: unguessable confirmation reference (48 bits of entropy)
      referenceNumber:
        body.referenceNumber ?? `ALB-${randomBytes(6).toString('hex').toUpperCase()}`,
      reservationExpiresAt: body.reservationExpiresAt
        ? parseIsoDate(body.reservationExpiresAt, 'reservationExpiresAt')
        : new Date(now + 24 * 60 * 60 * 1000),
      paymentDeadline: body.paymentDeadline
        ? parseIsoDate(body.paymentDeadline, 'paymentDeadline')
        : new Date(now + 48 * 60 * 60 * 1000),
    });

    return c.json<ApiResponse<Booking>>({
      success: true,
      data: booking,
      message: 'Booking created successfully',
      timestamp: new Date().toISOString(),
    }, 201);
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    // Atomic bed-claim failure surfaces as an Error from the transaction
    if (String(error).includes('unavailable')) {
      throw new HTTPException(409, { message: String(error) });
    }
    throw new HTTPException(400, { message: `Failed to create booking: ${String(error)}` });
  }
});

/**
 * POST /bookings/quote - Authoritative server-side price quote (BOOK-001)
 * Public: guests need a quote before they commit to booking.
 */
bookings.post('/quote', async (c: Context) => {
  try {
    const body = await c.req.json<BookingQuoteRequest>();
    if (!body.bedId || !body.checkInDate || !body.checkOutDate) {
      throw new HTTPException(400, {
        message: 'Missing required fields: bedId, checkInDate, checkOutDate',
      });
    }

    const quote = await computeBookingQuote(body.bedId, body.checkInDate, body.checkOutDate);
    if (!quote) throw new HTTPException(404, { message: 'Bed not found or invalid dates' });

    return c.json<ApiResponse<BookingQuote>>({
      success: true,
      data: quote,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to compute quote: ${String(error)}` });
  }
});

/**
 * PATCH /bookings/:id/status - Transition booking status
 */
bookings.patch('/:id/status', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid booking ID' });

    const { status } = await c.req.json<UpdateBookingStatusRequest>();
    if (!BOOKING_STATUSES.includes(status)) {
      throw new HTTPException(400, {
        message: `Invalid status: expected one of ${BOOKING_STATUSES.join(', ')}`,
      });
    }

    const success = await updateBookingStatus(id, status);
    if (!success) throw new HTTPException(404, { message: 'Booking not found' });

    return c.json<ApiResponse<null>>({
      success: true,
      message: `Booking status updated to ${status}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to update booking status: ${String(error)}` });
  }
});

export default bookings;
