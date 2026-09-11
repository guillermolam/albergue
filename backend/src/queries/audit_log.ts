/**
 * Audit Log Queries
 * Read operations for audit_log
 */

import { db } from '../lib/db';
import { auditLog, users } from '../../domain_model/schema';
import { eq, and, or, like, count, desc, asc, gte, lte } from 'drizzle-orm';
import type { AuditLog } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all audit log entries with pagination
 */
export async function getAllAuditLogs(
  params: PaginationParams = {}
): Promise<PaginatedResponse<AuditLog>> {
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
    .from(auditLog);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(auditLog)
    .orderBy(
      // @ts-ignore
      orderBy in auditLog ? auditLog[orderBy] : auditLog.createdAt,
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
 * Get audit log entry by ID
 */
export async function getAuditLogById(id: number): Promise<AuditLog | null> {
  const [result] = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get audit logs by table name
 */
export async function getAuditLogsByTable(tableName: string): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.tableName, tableName))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit logs by record ID
 */
export async function getAuditLogsByRecord(recordId: string): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.recordId, recordId))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit logs by action
 */
export async function getAuditLogsByAction(action: string): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.action, action))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit logs by user ID
 */
export async function getAuditLogsByUser(userId: number): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.userId, userId))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit logs by date range
 */
export async function getAuditLogsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(
      and(
        // @ts-ignore
        gte(auditLog.createdAt, startDate),
        // @ts-ignore
        lte(auditLog.createdAt, endDate)
      )
    )
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit logs with user details
 */
export async function getAuditLogsWithUsers() {
  const results = await db
    .select({
      log: auditLog,
      user: {
        id: users.id,
        username: users.username,
      },
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.userId, users.id))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats() {
  const [total] = await db
    .select({ count: count() })
    .from(auditLog);

  // By table
  const byTable = await db
    .select({
      tableName: auditLog.tableName,
      count: count(),
    })
    .from(auditLog)
    .groupBy(auditLog.tableName);

  // By action
  const byAction = await db
    .select({
      action: auditLog.action,
      count: count(),
    })
    .from(auditLog)
    .groupBy(auditLog.action);

  // By user
  const byUser = await db
    .select({
      userId: auditLog.userId,
      count: count(),
    })
    .from(auditLog)
    .groupBy(auditLog.userId);

  // Recent activity
  const recentActivity = await db
    .select({
      id: auditLog.id,
      tableName: auditLog.tableName,
      recordId: auditLog.recordId,
      action: auditLog.action,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .orderBy(auditLog.createdAt, desc)
    .limit(10);

  return {
    totalLogs: total?.count || 0,
    byTable: Object.fromEntries(
      byTable.map(t => [t.tableName || 'unknown', t.count || 0])
    ),
    byAction: Object.fromEntries(
      byAction.map(a => [a.action || 'unknown', a.count || 0])
    ),
    byUser: Object.fromEntries(
      byUser.map(u => [String(u.userId || 'unknown'), u.count || 0])
    ),
    recentActivity: recentActivity.map(a => ({
      type: 'audit',
      id: a.id,
      timestamp: a.createdAt,
      description: `${a.action} on ${a.tableName} (${a.recordId})`,
    })),
  };
}

/**
 * Search audit logs
 */
export async function searchAuditLogs(query: string, limit: number = 10): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(
      or(
        like(auditLog.tableName, `%${query}%`),
        like(auditLog.recordId, `%${query}%`),
        like(auditLog.action, `%${query}%`)
      )
    )
    .orderBy(auditLog.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get recent audit logs
 */
export async function getRecentAuditLogs(limit: number = 10): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .orderBy(auditLog.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get audit logs for a specific table and record
 */
export async function getAuditLogsForRecord(
  tableName: string,
  recordId: string
): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(
      and(
        eq(auditLog.tableName, tableName),
        eq(auditLog.recordId, recordId)
      )
    )
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get create audit logs
 */
export async function getCreateAuditLogs(): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.action, 'create'))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get update audit logs
 */
export async function getUpdateAuditLogs(): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.action, 'update'))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}

/**
 * Get delete audit logs
 */
export async function getDeleteAuditLogs(): Promise<AuditLog[]> {
  const results = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.action, 'delete'))
    .orderBy(auditLog.createdAt, desc);
  
  return results;
}
