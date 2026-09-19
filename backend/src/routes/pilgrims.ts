/**
 * Pilgrim Routes
 * API endpoints for pilgrims
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import { authMiddleware } from '../lib/middleware.js';
import {
  getAllPilgrims,
  getPilgrimById,
  getPilgrimByEmail,
  getPilgrimByDocumentNumber,
  searchPilgrims,
  getPilgrimsWithActiveBookings,
  getPilgrimStats,
  getRecentPilgrims,
} from '../queries/pilgrims.js';
import {
  createPilgrim,
  createPilgrimsBatch,
  updatePilgrim,
  softDeletePilgrim,
  deletePilgrim,
  deactivatePilgrim,
  updatePilgrimLastAccess,
  updatePilgrimLanguage,
  updatePilgrimDocument,
  bulkUpdatePilgrims,
  cleanupExpiredPilgrims,
} from '../commands/pilgrims.js';
import type {
  CreatePilgrimInput,
  UpdatePilgrimInput,
  Pilgrim,
  ApiResponse,
  PaginatedResponse,
  PilgrimFilter,
  PilgrimStats,
} from '../types/index.js';

const pilgrims = new Hono();

/**
 * GET /pilgrims - Get all pilgrims with optional filters
 */
pilgrims.get('/', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { page, pageSize, orderBy, orderDirection, ...filters } = c.req.query();

    const params = {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orderBy: orderBy as string,
      orderDirection: orderDirection as 'asc' | 'desc',
      ...filters,
    };

    const result = await getAllPilgrims(params as any);

    return c.json<ApiResponse<PaginatedResponse<Pilgrim>>>({
      success: true,
      data: result,
      message: 'Pilgrims retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get pilgrims: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/email/:email - Get pilgrim by email
 */
pilgrims.get('/email/:email', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const email = c.req.param('email');
    if (!email) {
      throw new HTTPException(400, { message: 'email is required' });
    }
    const pilgrim = await getPilgrimByEmail(email);

    if (!pilgrim) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<Pilgrim>>({
      success: true,
      data: pilgrim,
      message: 'Pilgrim retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get pilgrim: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/document/:type/:number - Get pilgrim by document
 */
pilgrims.get('/document/:type/:number', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const type = c.req.param('type');
    const number = c.req.param('number');
    if (!type || !number) {
      throw new HTTPException(400, { message: 'document type and number are required' });
    }
    const pilgrim = await getPilgrimByDocumentNumber(type, number);

    if (!pilgrim) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<Pilgrim>>({
      success: true,
      data: pilgrim,
      message: 'Pilgrim retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get pilgrim: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/search - Search pilgrims
 */
pilgrims.get('/search', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { q, limit } = c.req.query();
    const query = q as string || '';
    const limitNum = limit ? Number(limit) : 10;

    const results = await searchPilgrims(query, limitNum);

    return c.json<ApiResponse<Pilgrim[]>>({
      success: true,
      data: results,
      message: 'Pilgrims search completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to search pilgrims: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/active-bookings - Get pilgrims with active bookings
 */
pilgrims.get('/active-bookings', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const results = await getPilgrimsWithActiveBookings();

    return c.json<ApiResponse<Pilgrim[]>>({
      success: true,
      data: results,
      message: 'Active booking pilgrims retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get active booking pilgrims: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/stats - Get pilgrim statistics
 */
pilgrims.get('/stats', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const stats = await getPilgrimStats();

    return c.json<ApiResponse<PilgrimStats>>({
      success: true,
      data: stats,
      message: 'Pilgrim statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get pilgrim statistics: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/recent - Get recent pilgrims
 */
pilgrims.get('/recent', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const { limit } = c.req.query();
    const limitNum = limit ? Number(limit) : 5;

    const results = await getRecentPilgrims(limitNum);

    return c.json<ApiResponse<Pilgrim[]>>({
      success: true,
      data: results,
      message: 'Recent pilgrims retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get recent pilgrims: ${String(error)}`,
    });
  }
});

/**
 * GET /pilgrims/:id - Get pilgrim by ID
 * Registered after every static-segment GET route above: Hono matches
 * routes in registration order, and this single-segment wildcard would
 * otherwise shadow static paths like /search or /stats.
 */
pilgrims.get('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const pilgrim = await getPilgrimById(id);

    if (!pilgrim) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<Pilgrim>>({
      success: true,
      data: pilgrim,
      message: 'Pilgrim retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get pilgrim: ${String(error)}`,
    });
  }
});

/**
 * POST /pilgrims - Create a new pilgrim
 * Public: this is the guest self-registration step of the booking flow.
 */
pilgrims.post('/', async (c: Context) => {
  try {
    const body = await c.req.json<CreatePilgrimInput>();
    const pilgrim = await createPilgrim(body);

    return c.json<ApiResponse<Pilgrim>>({
      success: true,
      data: pilgrim,
      message: 'Pilgrim created successfully',
      timestamp: new Date().toISOString(),
    }, 201);
  } catch (error) {
    throw new HTTPException(400, {
      message: `Failed to create pilgrim: ${String(error)}`,
    });
  }
});

/**
 * POST /pilgrims/batch - Create multiple pilgrims
 */
pilgrims.post('/batch', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const bodies = await c.req.json<CreatePilgrimInput[]>();
    const pilgrims = await createPilgrimsBatch(bodies);

    return c.json<ApiResponse<Pilgrim[]>>({
      success: true,
      data: pilgrims,
      message: 'Pilgrims batch created successfully',
      timestamp: new Date().toISOString(),
    }, 201);
  } catch (error) {
    throw new HTTPException(400, {
      message: `Failed to create pilgrims batch: ${String(error)}`,
    });
  }
});

/**
 * PUT /pilgrims/:id - Update a pilgrim
 */
pilgrims.put('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const body = await c.req.json<UpdatePilgrimInput>();

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const pilgrim = await updatePilgrim(id, body);

    if (!pilgrim) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<Pilgrim>>({
      success: true,
      data: pilgrim,
      message: 'Pilgrim updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to update pilgrim: ${String(error)}`,
    });
  }
});

/**
 * PATCH /pilgrims/:id/language - Update pilgrim language
 */
pilgrims.patch('/:id/language', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const { language } = await c.req.json<{ language: string }>();

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const success = await updatePilgrimLanguage(id, language);

    if (!success) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Pilgrim language updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to update pilgrim language: ${String(error)}`,
    });
  }
});

/**
 * PATCH /pilgrims/:id/last-access - Update pilgrim last access date
 */
pilgrims.patch('/:id/last-access', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const success = await updatePilgrimLastAccess(id);

    if (!success) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Pilgrim last access updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to update pilgrim last access: ${String(error)}`,
    });
  }
});

/**
 * DELETE /pilgrims/:id - Soft delete a pilgrim
 */
pilgrims.delete('/:id', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const success = await softDeletePilgrim(id);

    if (!success) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Pilgrim soft deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to soft delete pilgrim: ${String(error)}`,
    });
  }
});

/**
 * DELETE /pilgrims/:id/force - Hard delete a pilgrim
 */
pilgrims.delete('/:id/force', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const success = await deletePilgrim(id);

    if (!success) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Pilgrim hard deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to hard delete pilgrim: ${String(error)}`,
    });
  }
});

/**
 * POST /pilgrims/:id/deactivate - Deactivate a pilgrim
 */
pilgrims.post('/:id/deactivate', authMiddleware({ roles: ['admin'] }), async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    }

    const success = await deactivatePilgrim(id);

    if (!success) {
      throw new HTTPException(404, { message: 'Pilgrim not found' });
    }

    return c.json<ApiResponse<null>>({
      success: true,
      message: 'Pilgrim deactivated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, {
      message: `Failed to deactivate pilgrim: ${String(error)}`,
    });
  }
});

export default pilgrims;
