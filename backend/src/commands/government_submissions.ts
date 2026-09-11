/**
 * Government Submission Commands
 * Write operations for government_submissions
 */

import { db } from '../lib/db';
import { governmentSubmissions } from '../../domain_model/schema';
import { eq, and } from 'drizzle-orm';
import type { InsertGovernmentSubmission, GovernmentSubmission } from '../types';

/**
 * Create a new government submission
 */
export async function createGovernmentSubmission(
  input: InsertGovernmentSubmission
): Promise<GovernmentSubmission> {
  const [result] = await db
    .insert(governmentSubmissions)
    .values({
      ...input,
      submissionStatus: input.submissionStatus || 'pending',
      attempts: input.attempts || 0,
      createdAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create government submission');
  }
  
  return result;
}

/**
 * Create multiple government submissions (batch)
 */
export async function createGovernmentSubmissionsBatch(
  inputs: InsertGovernmentSubmission[]
): Promise<GovernmentSubmission[]> {
  const results = await db
    .insert(governmentSubmissions)
    .values(
      inputs.map(input => ({
        ...input,
        submissionStatus: input.submissionStatus || 'pending',
        attempts: input.attempts || 0,
        createdAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Update a government submission
 */
export async function updateGovernmentSubmission(
  id: number,
  updates: Partial<InsertGovernmentSubmission>
): Promise<GovernmentSubmission | null> {
  const [existing] = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }
  
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return result || null;
}

/**
 * Mark submission as successful
 */
export async function markSubmissionAsSuccessful(
  id: number,
  responseData?: any
): Promise<boolean> {
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      submissionStatus: 'success',
      responseData,
      lastAttempt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark submission as failed
 */
export async function markSubmissionAsFailed(
  id: number,
  errorMessage?: string
): Promise<boolean> {
  const [existing] = await db
    .select({ attempts: governmentSubmissions.attempts })
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.id, id))
    .limit(1);
  
  if (!existing) {
    return false;
  }
  
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      submissionStatus: 'failed',
      attempts: existing.attempts + 1,
      lastAttempt: new Date(),
      responseData: { error: errorMessage },
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Increment attempt count
 */
export async function incrementSubmissionAttempts(id: number): Promise<boolean> {
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      // @ts-ignore - drizzle increment
      attempts: governmentSubmissions.attempts + 1,
      lastAttempt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark submission as pending retry
 */
export async function markSubmissionAsPendingRetry(id: number): Promise<boolean> {
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      submissionStatus: 'pending_retry',
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update XML content
 */
export async function updateSubmissionXmlContent(
  id: number,
  xmlContent: string
): Promise<boolean> {
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      xmlContent,
      submissionStatus: 'pending',
      attempts: 0,
      lastAttempt: null,
      responseData: null,
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a government submission (soft delete)
 */
export async function softDeleteGovernmentSubmission(id: number): Promise<boolean> {
  const [result] = await db
    .update(governmentSubmissions)
    .set({
      submissionStatus: 'deleted',
      xmlContent: '(DELETED)',
      responseData: null,
      updatedAt: new Date(),
    })
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a government submission (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deleteGovernmentSubmission(id: number): Promise<boolean> {
  const [result] = await db
    .delete(governmentSubmissions)
    .where(eq(governmentSubmissions.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk delete government submissions
 */
export async function bulkDeleteGovernmentSubmissions(ids: number[]): Promise<number> {
  const results = await db
    .delete(governmentSubmissions)
    .where(and(...ids.map(id => eq(governmentSubmissions.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Retry failed submissions
 */
export async function retryFailedSubmissions(bookingId: number): Promise<number> {
  const results = await db
    .update(governmentSubmissions)
    .set({
      submissionStatus: 'pending_retry',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(governmentSubmissions.bookingId, bookingId),
        eq(governmentSubmissions.submissionStatus, 'failed')
      )
    )
    .returning();
  
  return results.length;
}
