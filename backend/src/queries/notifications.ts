/**
 * Notification Queries
 * Read operations for notifications
 */

import { db } from '../lib/db';
import { notifications, bookings, pilgrims } from '../../domain_model/schema';
import { eq, and, or, like, count, desc, asc, gte, lte } from 'drizzle-orm';
import type { Notification } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all notifications with pagination
 */
export async function getAllNotifications(
  params: PaginationParams = {}
): Promise<PaginatedResponse<Notification>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = 'createdAt',
    orderDirection = 'desc',
  } = params;

  const offset = (page - 1) * pageSize;
  const order = orderDirection === 'asc' ? asc : desc;

  // Get total count
  const [countResult] = await db
    .select({ count: count() })
    .from(notifications);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(notifications)
    .orderBy(
      // @ts-ignore
      orderBy in notifications ? notifications[orderBy] : notifications.createdAt,
      order
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
 * Get notification by ID
 */
export async function getNotificationById(id: number): Promise<Notification | null> {
  const [result] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get notifications by booking ID
 */
export async function getNotificationsByBooking(bookingId: number): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.bookingId, bookingId))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get notifications by pilgrim ID
 */
export async function getNotificationsByPilgrim(pilgrimId: number): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.pilgrimId, pilgrimId))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get notifications by channel
 */
export async function getNotificationsByChannel(channel: string): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.channel, channel))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get notifications by status
 */
export async function getNotificationsByStatus(status: string): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.status, status))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get pending notifications
 */
export async function getPendingNotifications(): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(
      or(
        eq(notifications.status, 'pending'),
        eq(notifications.status, 'pending_retry')
      )
    )
    .orderBy(notifications.createdAt, asc);
  
  return results;
}

/**
 * Get failed notifications
 */
export async function getFailedNotifications(): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.status, 'failed'))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get sent notifications
 */
export async function getSentNotifications(): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.status, 'sent'))
    .orderBy(notifications.sentAt, desc);
  
  return results;
}

/**
 * Get notifications by date range
 */
export async function getNotificationsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(
      and(
        // @ts-ignore
        gte(notifications.createdAt, startDate),
        // @ts-ignore
        lte(notifications.createdAt, endDate)
      )
    )
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get notification with booking and pilgrim details
 */
export async function getNotificationWithDetails(id: number) {
  const [result] = await db
    .select({
      notification: notifications,
      booking: bookings,
      pilgrim: pilgrims,
    })
    .from(notifications)
    .leftJoin(bookings, eq(notifications.bookingId, bookings.id))
    .leftJoin(pilgrims, eq(notifications.pilgrimId, pilgrims.id))
    .where(eq(notifications.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Search notifications
 */
export async function searchNotifications(query: string, limit: number = 10): Promise<Notification[]> {
  const results = await db
    .select({
      notification: notifications,
      booking: {
        referenceNumber: bookings.referenceNumber,
      },
      pilgrim: {
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
      },
    })
    .from(notifications)
    .leftJoin(bookings, eq(notifications.bookingId, bookings.id))
    .leftJoin(pilgrims, eq(notifications.pilgrimId, pilgrims.id))
    .where(
      or(
        like(notifications.subject, `%${query}%`),
        like(notifications.message, `%${query}%`),
        like(notifications.recipient, `%${query}%`),
        like(bookings.referenceNumber, `%${query}%`)
      )
    )
    .orderBy(notifications.createdAt, desc)
    .limit(limit);
  
  return results.map(r => r.notification);
}

/**
 * Get notification statistics
 */
export async function getNotificationStats() {
  const [total] = await db
    .select({ count: count() })
    .from(notifications);

  const [pending] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      or(
        eq(notifications.status, 'pending'),
        eq(notifications.status, 'pending_retry')
      )
    );

  const [sent] = await db
    .select({ count: count() })
    .from(notifications)
    .where(eq(notifications.status, 'sent'));

  const [delivered] = await db
    .select({ count: count() })
    .from(notifications)
    .where(eq(notifications.status, 'delivered'));

  const [failed] = await db
    .select({ count: count() })
    .from(notifications)
    .where(eq(notifications.status, 'failed'));

  // By channel
  const byChannel = await db
    .select({
      channel: notifications.channel,
      count: count(),
    })
    .from(notifications)
    .groupBy(notifications.channel);

  // By status
  const byStatus = await db
    .select({
      status: notifications.status,
      count: count(),
    })
    .from(notifications)
    .groupBy(notifications.status);

  return {
    totalNotifications: total?.count || 0,
    pendingCount: pending?.count || 0,
    sentCount: sent?.count || 0,
    deliveredCount: delivered?.count || 0,
    failedCount: failed?.count || 0,
    byChannel: Object.fromEntries(
      byChannel.map(c => [c.channel || 'unknown', c.count || 0])
    ),
    byStatus: Object.fromEntries(
      byStatus.map(s => [s.status || 'unknown', s.count || 0])
    ),
  };
}

/**
 * Get recent notifications
 */
export async function getRecentNotifications(limit: number = 10): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .orderBy(notifications.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get notifications by recipient
 */
export async function getNotificationsByRecipient(recipient: string): Promise<Notification[]> {
  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.recipient, recipient))
    .orderBy(notifications.createdAt, desc);
  
  return results;
}

/**
 * Get unread notifications count for a pilgrim
 */
export async function getUnreadNotificationsCount(pilgrimId: number): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.pilgrimId, pilgrimId),
        or(
          eq(notifications.status, 'pending'),
          eq(notifications.status, 'sent'),
          eq(notifications.status, 'delivered')
        )
      )
    );
  
  return result?.count || 0;
}
