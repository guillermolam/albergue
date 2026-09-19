/**
 * Bed Routes
 * API endpoints for beds
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import { authMiddleware } from '../lib/middleware.js';
import {
  getAllBeds,
  getBedById,
  getBedByRoomAndNumber,
  getAvailableBeds,
  getOccupiedBeds,
  getBedsInMaintenance,
  getBedsByRoomType,
  getBedsByRoomNumber,
  searchBeds,
  getBedStats,
  getRecentBeds,
  getBedsWithBookings,
} from '../queries/beds.js';
import {
  createBed,
  createBedsBatch,
  updateBed,
  updateBedAvailability,
  reserveBed,
  releaseBed,
  updateBedMaintenance,
  updateBedPricing,
  softDeleteBed,
  deleteBed,
  bulkUpdateBeds,
  cleanupExpiredReservations,
} from '../commands/beds.js';
import type { Bed, ApiResponse, PaginatedResponse, BedStats } from '../types/index.js';

const beds = new Hono();

/**
 * GET /beds - Get all beds with optional filters
 */
beds.get('/', async (c: Context) => {
  try {
    const { page, pageSize, orderBy, orderDirection, ...filters } = c.req.query();
    const result = await getAllBeds({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orderBy: orderBy as string,
      orderDirection: orderDirection as 'asc' | 'desc',
      ...filters,
    } as any);

    return c.json<ApiResponse<PaginatedResponse<Bed>>>({
      success: true,
      data: result,
      message: 'Beds retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get beds: ${String(error)}` });
  }
});

/**
 * GET /beds/available - Get available beds
 */
beds.get('/available', async (c: Context) => {
  try {
    const beds = await getAvailableBeds();
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Available beds retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get available beds: ${String(error)}` });
  }
});

/**
 * GET /beds/occupied - Get occupied beds
 */
beds.get('/occupied', async (c: Context) => {
  try {
    const beds = await getOccupiedBeds();
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Occupied beds retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get occupied beds: ${String(error)}` });
  }
});

/**
 * GET /beds/maintenance - Get beds in maintenance
 */
beds.get('/maintenance', async (c: Context) => {
  try {
    const beds = await getBedsInMaintenance();
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Maintenance beds retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get maintenance beds: ${String(error)}` });
  }
});

/**
 * GET /beds/stats - Get bed statistics
 */
beds.get('/stats', async (c: Context) => {
  try {
    const stats = await getBedStats();
    return c.json<ApiResponse<BedStats>>({
      success: true,
      data: stats,
      message: 'Bed statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get bed statistics: ${String(error)}` });
  }
});

/**
 * GET /beds/room/:roomNumber - Get beds by room number
 */
beds.get('/room/:roomNumber', async (c: Context) => {
  try {
    const roomNumber = Number(c.req.param('roomNumber'));
    if (isNaN(roomNumber)) throw new HTTPException(400, { message: 'Invalid room number' });

    const beds = await getBedsByRoomNumber(roomNumber);
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Beds by room retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get beds by room: ${String(error)}` });
  }
});

/**
 * GET /beds/type/:roomType - Get beds by room type
 */
beds.get('/type/:roomType', async (c: Context) => {
  try {
    const roomType = c.req.param('roomType');
    if (!roomType) {
      throw new HTTPException(400, { message: 'roomType is required' });
    }
    const beds = await getBedsByRoomType(roomType);
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Beds by type retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get beds by type: ${String(error)}` });
  }
});

/**
 * GET /beds/:id - Get bed by ID
 * Registered after every static-segment GET route above: Hono matches
 * routes in registration order, and this single-segment wildcard would
 * otherwise shadow static paths like /available or /stats.
 */
beds.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid bed ID' });

    const bed = await getBedById(id);
    if (!bed) throw new HTTPException(404, { message: 'Bed not found' });

    return c.json<ApiResponse<Bed>>({
      success: true,
      data: bed,
      message: 'Bed retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get bed: ${String(error)}` });
  }
});

/**
 * POST /beds - Create a new bed
 */
beds.post('/', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const body = await c.req.json();
    const bed = await createBed(body);
    return c.json<ApiResponse<Bed>>({
      success: true,
      data: bed,
      message: 'Bed created successfully',
      timestamp: new Date().toISOString(),
    }, 201);
  } catch (error) {
    throw new HTTPException(400, { message: `Failed to create bed: ${String(error)}` });
  }
});

/**
 * POST /beds/batch - Create multiple beds
 */
beds.post('/batch', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const bodies = await c.req.json();
    const beds = await createBedsBatch(bodies);
    return c.json<ApiResponse<Bed[]>>({
      success: true,
      data: beds,
      message: 'Beds batch created successfully',
      timestamp: new Date().toISOString(),
    }, 201);
  } catch (error) {
    throw new HTTPException(400, { message: `Failed to create beds batch: ${String(error)}` });
  }
});

/**
 * PUT /beds/:id - Update a bed
 */
beds.put('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid bed ID' });

    const body = await c.req.json();
    const bed = await updateBed(id, body);
    if (!bed) throw new HTTPException(404, { message: 'Bed not found' });

    return c.json<ApiResponse<Bed>>({
      success: true,
      data: bed,
      message: 'Bed updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to update bed: ${String(error)}` });
  }
});

/**
 * PATCH /beds/:id/reserve - Reserve a bed
 * Reservation duration is server-controlled (capped at 24h), not
 * client-supplied — an unbounded client-chosen reservedUntil would let any
 * caller lock a bed indefinitely (inventory DoS).
 */
const MAX_RESERVATION_HOURS = 24;

beds.patch('/:id/reserve', authMiddleware({ requireAuth: true }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid bed ID' });

    const body = await c.req.json().catch(() => ({}));
    const status = typeof body.status === 'string' ? body.status : 'reserved';
    const maxReservedUntil = new Date(Date.now() + MAX_RESERVATION_HOURS * 60 * 60 * 1000);
    const requested = body.reservedUntil ? new Date(body.reservedUntil) : maxReservedUntil;
    const reservedUntil =
      Number.isNaN(requested.getTime()) || requested > maxReservedUntil
        ? maxReservedUntil
        : requested;

    const success = await reserveBed(id, reservedUntil, status);
    // Atomic claim fails when the bed is taken (409) or missing (404)
    if (!success) throw new HTTPException(409, { message: 'Bed unavailable or not found' });

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Bed reserved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to reserve bed: ${String(error)}` });
  }
});

/**
 * PATCH /beds/:id/release - Release a bed
 */
beds.patch('/:id/release', authMiddleware({ requireAuth: true }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid bed ID' });

    const success = await releaseBed(id);
    if (!success) throw new HTTPException(404, { message: 'Bed not found' });

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Bed released successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to release bed: ${String(error)}` });
  }
});

/**
 * POST /beds/cleanup-expired - Release beds whose reservation TTL has lapsed (BOOK-003)
 */
beds.post('/cleanup-expired', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const released = await cleanupExpiredReservations();
    return c.json<ApiResponse<{ released: number }>>({
      success: true,
      data: { released },
      message: `Released ${released} expired reservation(s)`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to cleanup expired reservations: ${String(error)}` });
  }
});

/**
 * DELETE /beds/:id - Soft delete a bed
 */
beds.delete('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid bed ID' });

    const success = await softDeleteBed(id);
    if (!success) throw new HTTPException(404, { message: 'Bed not found' });

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Bed soft deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to soft delete bed: ${String(error)}` });
  }
});

export default beds;
