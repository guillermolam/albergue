/**
 * Payment Queries
 * Read operations for payments
 */

import { db } from '../lib/db';
import { payments, bookings, pilgrims } from '../../domain_model/schema';
import { eq, and, or, like, count, sum, desc, asc, gte, lte, between } from 'drizzle-orm';
import type { Payment } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all payments with pagination
 */
export async function getAllPayments(
  params: PaginationParams = {}
): Promise<PaginatedResponse<Payment>> {
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
    .from(payments);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await db
    .select()
    .from(payments)
    .orderBy(
      // @ts-ignore
      orderBy in payments ? payments[orderBy] : payments.createdAt,
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
 * Get payment by ID
 */
export async function getPaymentById(id: number): Promise<Payment | null> {
  const [result] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get payments by booking ID
 */
export async function getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
  const results = await db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, bookingId))
    .orderBy(payments.createdAt, desc);
  
  return results;
}

/**
 * Get payments by status
 */
export async function getPaymentsByStatus(status: string): Promise<Payment[]> {
  const results = await db
    .select()
    .from(payments)
    .where(eq(payments.paymentStatus, status))
    .orderBy(payments.createdAt, desc);
  
  return results;
}

/**
 * Get pending payments
 */
export async function getPendingPayments(): Promise<Payment[]> {
  const now = new Date();
  
  const results = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.paymentStatus, 'awaiting_payment'),
        // @ts-ignore
        gte(payments.paymentDeadline, now)
      )
    )
    .orderBy(payments.paymentDeadline, asc);
  
  return results;
}

/**
 * Get overdue payments
 */
export async function getOverduePayments(): Promise<Payment[]> {
  const now = new Date();
  
  const results = await db
    .select({
      payment: payments,
      booking: {
        referenceNumber: bookings.referenceNumber,
        pilgrimId: bookings.pilgrimId,
      },
      pilgrim: {
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        email: pilgrims.email,
        phone: pilgrims.phone,
      },
    })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .innerJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      and(
        eq(payments.paymentStatus, 'awaiting_payment'),
        // @ts-ignore
        lte(payments.paymentDeadline, now)
      )
    )
    .orderBy(payments.paymentDeadline, asc);
  
  return results.map(r => r.payment);
}

/**
 * Get paid payments
 */
export async function getPaidPayments(): Promise<Payment[]> {
  const results = await db
    .select()
    .from(payments)
    .where(eq(payments.paymentStatus, 'paid'))
    .orderBy(payments.paymentDate, desc);
  
  return results;
}

/**
 * Get payments by date range
 */
export async function getPaymentsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Payment[]> {
  const results = await db
    .select()
    .from(payments)
    .where(
      and(
        // @ts-ignore
        gte(payments.paymentDate, startDate),
        // @ts-ignore
        lte(payments.paymentDate, endDate)
      )
    )
    .orderBy(payments.paymentDate, desc);
  
  return results;
}

/**
 * Get payments by transaction ID
 */
export async function getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
  const [result] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionId, transactionId))
    .limit(1);
  
  return result || null;
}

/**
 * Get payments by receipt number
 */
export async function getPaymentByReceiptNumber(receiptNumber: string): Promise<Payment | null> {
  const [result] = await db
    .select()
    .from(payments)
    .where(eq(payments.receiptNumber, receiptNumber))
    .limit(1);
  
  return result || null;
}

/**
 * Get payment statistics
 */
export async function getPaymentStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total payments
  const [total] = await db
    .select({ count: count() })
    .from(payments);

  // Total revenue
  const [revenue] = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(eq(payments.paymentStatus, 'paid'));

  // Pending payments
  const [pending] = await db
    .select({ count: count() })
    .from(payments)
    .where(
      and(
        eq(payments.paymentStatus, 'awaiting_payment'),
        // @ts-ignore
        gte(payments.paymentDeadline, now)
      )
    );

  // Overdue payments
  const [overdue] = await db
    .select({ count: count() })
    .from(payments)
    .where(
      and(
        eq(payments.paymentStatus, 'awaiting_payment'),
        // @ts-ignore
        lte(payments.paymentDeadline, now)
      )
    );

  // Monthly payments
  const [monthly] = await db
    .select({ count: count() })
    .from(payments)
    .where(
      and(
        eq(payments.paymentStatus, 'paid'),
        // @ts-ignore
        gte(payments.paymentDate, startOfMonth)
      )
    );

  // Failed payments
  const [failed] = await db
    .select({ count: count() })
    .from(payments)
    .where(eq(payments.paymentStatus, 'failed'));

  // Refunded payments
  const [refunded] = await db
    .select({ count: count() })
    .from(payments)
    .where(eq(payments.paymentStatus, 'refunded'));

  // Payment by type
  const paymentTypeStats = await db
    .select({
      paymentType: payments.paymentType,
      count: count(),
      total: sum(payments.amount),
    })
    .from(payments)
    .where(eq(payments.paymentStatus, 'paid'))
    .groupBy(payments.paymentType);

  return {
    totalPayments: total?.count || 0,
    totalRevenue: revenue?.total || '0',
    pendingCount: pending?.count || 0,
    overdueCount: overdue?.count || 0,
    monthlyPayments: monthly?.count || 0,
    failedCount: failed?.count || 0,
    refundedCount: refunded?.count || 0,
    byPaymentType: Object.fromEntries(
      paymentTypeStats.map(s => [
        s.paymentType || 'unknown',
        {
          count: s.count || 0,
          total: s.total || '0',
        }
      ])
    ),
  };
}

/**
 * Get recent payments
 */
export async function getRecentPayments(limit: number = 10): Promise<Payment[]> {
  const results = await db
    .select()
    .from(payments)
    .orderBy(payments.createdAt, desc)
    .limit(limit);
  
  return results;
}

/**
 * Get payment with booking details
 */
export async function getPaymentWithDetails(id: number) {
  const [result] = await db
    .select({
      payment: payments,
      booking: bookings,
      pilgrim: pilgrims,
    })
    .from(payments)
    .leftJoin(bookings, eq(payments.bookingId, bookings.id))
    .leftJoin(pilgrims, eq(bookings.pilgrimId, pilgrims.id))
    .where(eq(payments.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Search payments
 */
export async function searchPayments(query: string, limit: number = 10): Promise<Payment[]> {
  const results = await db
    .select({
      payment: payments,
      booking: {
        referenceNumber: bookings.referenceNumber,
      },
    })
    .from(payments)
    .leftJoin(bookings, eq(payments.bookingId, bookings.id))
    .where(
      or(
        like(payments.transactionId, `%${query}%`),
        like(payments.receiptNumber, `%${query}%`),
        like(bookings.referenceNumber, `%${query}%`)
      )
    )
    .orderBy(payments.createdAt, desc)
    .limit(limit);
  
  return results.map(r => r.payment);
}
