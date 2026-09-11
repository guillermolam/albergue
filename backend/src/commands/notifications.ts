/**
 * Notification Commands
 * Write operations for notifications
 */

import { db } from '../lib/db';
import { notifications } from '../../domain_model/schema';
import { eq, and, or } from 'drizzle-orm';
import type { InsertNotification, Notification } from '../types';

/**
 * Create a new notification
 */
export async function createNotification(input: InsertNotification): Promise<Notification> {
  const [result] = await db
    .insert(notifications)
    .values({
      ...input,
      status: input.status || 'pending',
      createdAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create notification');
  }
  
  return result;
}

/**
 * Create multiple notifications (batch)
 */
export async function createNotificationsBatch(
  inputs: InsertNotification[]
): Promise<Notification[]> {
  const results = await db
    .insert(notifications)
    .values(
      inputs.map(input => ({
        ...input,
        status: input.status || 'pending',
        createdAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Update a notification
 */
export async function updateNotification(
  id: number,
  updates: Partial<InsertNotification>
): Promise<Notification | null> {
  const [existing] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }
  
  const [result] = await db
    .update(notifications)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return result || null;
}

/**
 * Mark notification as sent
 */
export async function markNotificationAsSent(
  id: number,
  providerMessageId?: string
): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      status: 'sent',
      sentAt: new Date(),
      providerMessageId,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark notification as failed
 */
export async function markNotificationAsFailed(
  id: number,
  errorMessage?: string
): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      status: 'failed',
      errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark notification as delivered
 */
export async function markNotificationAsDelivered(id: number): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      status: 'delivered',
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: number): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      status: 'read',
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Retry failed notifications
 */
export async function retryFailedNotifications(): Promise<number> {
  const results = await db
    .update(notifications)
    .set({
      status: 'pending_retry',
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.status, 'failed'),
        or(
          isNull(notifications.attempts),
          // @ts-ignore
          notifications.attempts.lt(3)
        )
      )
    )
    .returning();
  
  return results.length;
}

/**
 * Delete a notification (soft delete)
 */
export async function softDeleteNotification(id: number): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      status: 'deleted',
      subject: '(DELETED)',
      message: '(DELETED)',
      recipient: '(DELETED)',
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a notification (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deleteNotification(id: number): Promise<boolean> {
  const [result] = await db
    .delete(notifications)
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk delete notifications
 */
export async function bulkDeleteNotifications(ids: number[]): Promise<number> {
  const results = await db
    .delete(notifications)
    .where(and(...ids.map(id => eq(notifications.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Update notification provider message ID
 */
export async function updateNotificationProviderMessageId(
  id: number,
  providerMessageId: string
): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({
      providerMessageId,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();
  
  return !!result;
}

/**
 * Cleanup old notifications
 */
export async function cleanupOldNotifications(days: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const results = await db
    .delete(notifications)
    .where(
      and(
        or(
          eq(notifications.status, 'sent'),
          eq(notifications.status, 'delivered'),
          eq(notifications.status, 'read')
        ),
        // @ts-ignore
        notifications.createdAt.lt(cutoffDate)
      )
    )
    .returning();
  
  return results.length;
}
