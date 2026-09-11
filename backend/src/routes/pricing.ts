/**
 * Pricing Routes
 */
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import {
  getAllPricing,
  getPricingById,
  getActivePricing,
  getPricingByRoomType,
  getPricingStats,
  searchPricing,
} from '../queries/pricing.js';
import type { Pricing, ApiResponse, PaginatedResponse } from '../types/index.js';

const pricing = new Hono();

pricing.get('/', async (c: Context) => {
  try {
    const { page, pageSize, orderBy, orderDirection } = c.req.query();
    const result = await getAllPricing({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      orderBy: orderBy as string,
      orderDirection: orderDirection as 'asc' | 'desc',
    });
    return c.json<ApiResponse<PaginatedResponse<Pricing>>>({
      success: true,
      data: result,
      message: 'Pricing retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pricing: ${String(error)}` });
  }
});

pricing.get('/active', async (c: Context) => {
  try {
    const pricing = await getActivePricing();
    return c.json<ApiResponse<Pricing[]>>({
      success: true,
      data: pricing,
      message: 'Active pricing retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get active pricing: ${String(error)}` });
  }
});

pricing.get('/room-type/:roomType', async (c: Context) => {
  try {
    const roomType = c.req.param('roomType')!;
    const pricing = await getPricingByRoomType(roomType);
    return c.json<ApiResponse<Pricing[]>>({
      success: true,
      data: pricing,
      message: 'Pricing by room type retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pricing by room type: ${String(error)}` });
  }
});

pricing.get('/stats', async (c: Context) => {
  try {
    const stats = await getPricingStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: 'Pricing statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pricing statistics: ${String(error)}` });
  }
});

export default pricing;
