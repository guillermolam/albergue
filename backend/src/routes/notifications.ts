/**
 * Notification Routes
 */
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import {
  getAllNotifications,
  getNotificationById,
  getNotificationsByBooking,
  getNotificationsByPilgrim,
  getPendingNotifications,
  getNotificationStats,
  getRecentNotifications,
} from '../queries/notifications.js';
import type { Notification, ApiResponse, PaginatedResponse } from '../types/index.js';

const notifications = new Hono();

notifications.get('/', async (c: Context) => {
  try {
    const { page, pageSize } = c.req.query();
    const result = await getAllNotifications({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return c.json<ApiResponse<PaginatedResponse<Notification>>>({
      success: true,
      data: result,
      message: 'Notifications retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get notifications: ${String(error)}` });
  }
});

notifications.get('/pilgrim/:pilgrimId', async (c: Context) => {
  try {
    const pilgrimId = Number(c.req.param('pilgrimId'));
    if (isNaN(pilgrimId)) throw new HTTPException(400, { message: 'Invalid pilgrim ID' });
    const notifications = await getNotificationsByPilgrim(pilgrimId);
    return c.json<ApiResponse<Notification[]>>({
      success: true,
      data: notifications,
      message: 'Notifications by pilgrim retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get notifications by pilgrim: ${String(error)}` });
  }
});

notifications.get('/pending', async (c: Context) => {
  try {
    const notifications = await getPendingNotifications();
    return c.json<ApiResponse<Notification[]>>({
      success: true,
      data: notifications,
      message: 'Pending notifications retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get pending notifications: ${String(error)}` });
  }
});

notifications.get('/stats', async (c: Context) => {
  try {
    const stats = await getNotificationStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: 'Notification statistics retrieved',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get notification statistics: ${String(error)}` });
  }
});

/**
 * GET /notifications/:id - Get notification by ID
 * Registered after every static-segment GET route above: Hono matches
 * routes in registration order, and this single-segment wildcard would
 * otherwise shadow static paths like /pending or /stats.
 */
notifications.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) throw new HTTPException(400, { message: 'Invalid notification ID' });
    const notification = await getNotificationById(id);
    if (!notification) throw new HTTPException(404, { message: 'Notification not found' });
    return c.json<ApiResponse<Notification>>({
      success: true,
      data: notification,
      message: 'Notification retrieved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get notification: ${String(error)}` });
  }
});

export default notifications;
