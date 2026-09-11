/**
 * Booking Routes
 * API endpoints for bookings
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
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
bookings.get('/', async (c: Context) => {
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
 * GET /bookings/:id - Get booking by ID
 */
bookings.get('/:id', async (c: Context) => {
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
 * GET /bookings/reference/:reference - Get booking by reference number
 */
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
bookings.get('/pilgrim/:pilgrimId', async (c: Context) => {
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
bookings.get('/active', async (c: Context) => {
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
bookings.get('/upcoming', async (c: Context) => {
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
bookings.get('/overdue', async (c: Context) => {
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
bookings.get('/stats', async (c: Context) => {
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
bookings.get('/recent', async (c: Context) => {
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
bookings.get('/search', async (c: Context) => {
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
bookings.get('/date-range', async (c: Context) => {
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
 * GET /bookings/:id/details - Get booking with full details
 */
bookings.get('/:id/details', async (c: Context) => {
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

export default bookings;
