/**
 * Audit Log Commands
 * Write operations for audit_log
 */

import { db } from '../lib/db';
import { auditLog } from '../../domain_model/schema';
import { eq, and, or } from 'drizzle-orm';
import type { InsertAuditLog, AuditLog } from '../types';

/**
 * Create a new audit log entry
 */
export async function createAuditLogEntry(input: InsertAuditLog): Promise<AuditLog> {
  const [result] = await db
    .insert(auditLog)
    .values({
      ...input,
      createdAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create audit log entry');
  }
  
  return result;
}

/**
 * Create multiple audit log entries (batch)
 */
export async function createAuditLogEntriesBatch(
  inputs: InsertAuditLog[]
): Promise<AuditLog[]> {
  const results = await db
    .insert(auditLog)
    .values(
      inputs.map(input => ({
        ...input,
        createdAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Log a create action
 */
export async function logCreateAction(
  tableName: string,
  recordId: string | number,
  newValues: any,
  userId?: number,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLog> {
  return createAuditLogEntry({
    tableName,
    recordId: String(recordId),
    action: 'create',
    oldValues: null,
    newValues,
    userId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log an update action
 */
export async function logUpdateAction(
  tableName: string,
  recordId: string | number,
  oldValues: any,
  newValues: any,
  userId?: number,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLog> {
  return createAuditLogEntry({
    tableName,
    recordId: String(recordId),
    action: 'update',
    oldValues,
    newValues,
    userId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log a delete action
 */
export async function logDeleteAction(
  tableName: string,
  recordId: string | number,
  oldValues: any,
  userId?: number,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLog> {
  return createAuditLogEntry({
    tableName,
    recordId: String(recordId),
    action: 'delete',
    oldValues,
    newValues: null,
    userId,
    ipAddress,
    userAgent,
  });
}

/**
 * Delete audit log entries (hard delete)
 * WARNING: Only use when absolutely necessary (compliance reasons)
 */
export async function deleteAuditLogEntry(id: number): Promise<boolean> {
  const [result] = await db
    .delete(auditLog)
    .where(eq(auditLog.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk delete audit log entries
 * WARNING: Only use when absolutely necessary
 */
export async function bulkDeleteAuditLogEntries(ids: number[]): Promise<number> {
  const results = await db
    .delete(auditLog)
    .where(and(...ids.map(id => eq(auditLog.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Cleanup old audit log entries
 * WARNING: Only use in compliance with data retention policies
 */
export async function cleanupOldAuditLogs(days: number = 365): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const results = await db
    .delete(auditLog)
    .where(
      and(
        // @ts-ignore
        auditLog.createdAt.lt(cutoffDate)
      )
    )
    .returning();
  
  return results.length;
}

/**
 * Anonymize audit log entries for GDPR compliance
 */
export async function anonymizeAuditLogEntries(
  userId: number
): Promise<number> {
  const results = await db
    .update(auditLog)
    .set({
      userId: null,
      ipAddress: null,
      userAgent: null,
    })
    .where(eq(auditLog.userId, userId))
    .returning();
  
  return results.length;
}
