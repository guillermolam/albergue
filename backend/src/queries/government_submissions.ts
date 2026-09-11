/**
 * Government Submission Queries
 * Read operations for government_submissions
 */

import { db } from '../lib/db';
import { governmentSubmissions, bookings, pilgrims } from '../../domain_model/schema';
import { eq, and, or, like, count, desc, asc, gte, lte } from 'drizzle-orm';
import type { GovernmentSubmission } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all government submissions with pagination
 */
export async function getAllGovernmentSubmissions(
  params: PaginationParams = {}
): Promise<PaginatedResponse<GovernmentSubmission>> {
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
    .from(governmentSubmissions);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(governmentSubmissions)
    .orderBy(
      // @ts-ignore
      orderBy in governmentSubmissions ? governmentSubmissions[orderBy] : governmentSubmissions.createdAt,
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
 * Get government submission by ID
 */
export async function getGovernmentSubmissionById(id: number): Promise<GovernmentSubmission | null> {
  const [result] = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get government submissions by booking ID
 */
export async function getGovernmentSubmissionsByBooking(bookingId: number): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.bookingId, bookingId))
    .orderBy(governmentSubmissions.createdAt, desc);
  
  return results;
}

/**
 * Get government submissions by status
 */
export async function getGovernmentSubmissionsByStatus(status: string): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.submissionStatus, status))
    .orderBy(governmentSubmissions.createdAt, desc);
  
  return results;
}

/**
 * Get pending government submissions
 */
export async function getPendingGovernmentSubmissions(): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(
      or(
        eq(governmentSubmissions.submissionStatus, 'pending'),
        eq(governmentSubmissions.submissionStatus, 'pending_retry')
      )
    )
    .orderBy(governmentSubmissions.createdAt, asc);
  
  return results;
}

/**
 * Get successful government submissions
 */
export async function getSuccessfulGovernmentSubmissions(): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.submissionStatus, 'success'))
    .orderBy(governmentSubmissions.lastAttempt, desc);
  
  return results;
}

/**
 * Get failed government submissions
 */
export async function getFailedGovernmentSubmissions(): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.submissionStatus, 'failed'))
    .orderBy(governmentSubmissions.lastAttempt, desc);
  
  return results;
}

/**
 * Get government submissions by date range
 */
export async function getGovernmentSubmissionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(
      and(
        // @ts-ignore
        gte(governmentSubmissions.createdAt, startDate),
        // @ts-ignore
        lte(governmentSubmissions.createdAt, endDate)
      )
    )
    .orderBy(governmentSubmissions.createdAt, desc);
  
  return results;
}

/**
 * Get government submissions with booking and pilgrim details
 */
export async function getGovernmentSubmissionWithDetails(id: number) {
  const [result] = await db
    .select({
      submission: governmentSubmissions,
      booking: bookings,
      pilgrim: pilgrims,
    })
    .from(governmentSubmissions)
    .leftJoin(bookings, eq(governmentSubmissions.bookingId, bookings.id))
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(eq(governmentSubmissions.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Search government submissions
 */
export async function searchGovernmentSubmissions(query: string, limit: number = 10): Promise<GovernmentSubmission[]> {
  const results = await db
    .select({
      submission: governmentSubmissions,
      booking: {
        referenceNumber: bookings.referenceNumber,
      },
      pilgrim: {
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
      },
    })
    .from(governmentSubmissions)
    .leftJoin(bookings, eq(governmentSubmissions.bookingId, bookings.id))
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      or(
        like(bookings.referenceNumber, `%${query}%`),
        like(pilgrims.firstName, `%${query}%`),
        like(pilgrims.lastName1, `%${query}%`)
      )
    )
    .orderBy(governmentSubmissions.createdAt, desc)
    .limit(limit);
  
  return results.map(r => r.submission);
}

/**
 * Get government submission statistics
 */
export async function getGovernmentSubmissionStats() {
  const [total] = await db
    .select({ count: count() })
    .from(governmentSubmissions);

  const [pending] = await db
    .select({ count: count() })
    .from(governmentSubmissions)
    .where(
      or(
        eq(governmentSubmissions.submissionStatus, 'pending'),
        eq(governmentSubmissions.submissionStatus, 'pending_retry')
      )
    );

  const [success] = await db
    .select({ count: count() })
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.submissionStatus, 'success'));

  const [failed] = await db
    .select({ count: count() })
    .from(governmentSubmissions)
    .where(eq(governmentSubmissions.submissionStatus, 'failed'));

  // Average attempts
  const [avgAttempts] = await db
    .select({
      // @ts-ignore
      avg: avg(governmentSubmissions.attempts)
    })
    .from(governmentSubmissions);

  // By booking
  const byBooking = await db
    .select({
      bookingId: governmentSubmissions.bookingId,
      count: count(),
      lastStatus: governmentSubmissions.submissionStatus,
    })
    .from(governmentSubmissions)
    .groupBy(governmentSubmissions.bookingId);

  return {
    totalSubmissions: total?.count || 0,
    pendingCount: pending?.count || 0,
    successCount: success?.count || 0,
    failedCount: failed?.count || 0,
    averageAttempts: avgAttempts?.avg ? parseFloat(String(avgAttempts.avg)) : 0,
    successRate: total?.count && total.count > 0 ? Math.round((success?.count || 0) / total.count * 100) : 0,
    byBooking: Object.fromEntries(
      byBooking.map(b => [
        String(b.bookingId),
        {
          count: b.count || 0,
          lastStatus: b.lastStatus,
        }
      ])
    ),
  };
}

/**
 * Get recent government submissions
 */
export async function getRecentGovernmentSubmissions(limit: number = 10): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .orderBy(governmentSubmissions.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get submissions needing retry
 */
export async function getSubmissionsNeedingRetry(maxAttempts: number = 3): Promise<GovernmentSubmission[]> {
  const results = await db
    .select()
    .from(governmentSubmissions)
    .where(
      and(
        eq(governmentSubmissions.submissionStatus, 'failed'),
        // @ts-ignore
        governmentSubmissions.attempts.lt(maxAttempts)
      )
    )
    .orderBy(governmentSubmissions.lastAttempt, asc);
  
  return results;
}

// Helper for average
function avg(column: any) {
  return { avg: sql`AVG(${column})` };
}
