/**
 * Payment Commands
 * Write operations for payments
 */

import { db } from '../lib/db';
import { payments } from '../../domain_model/schema';
import { eq, and } from 'drizzle-orm';
import type { InsertPayment, UpdatePaymentInput, Payment } from '../types';

/**
 * Create a new payment
 */
export async function createPayment(input: InsertPayment): Promise<Payment> {
  const [result] = await db
    .insert(payments)
    .values({
      ...input,
      paymentStatus: input.paymentStatus || 'awaiting_payment',
      currency: input.currency || 'EUR',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create payment');
  }
  
  return result;
}

/**
 * Create multiple payments (batch)
 */
export async function createPaymentsBatch(inputs: InsertPayment[]): Promise<Payment[]> {
  const results = await db
    .insert(payments)
    .values(
      inputs.map(input => ({
        ...input,
        paymentStatus: input.paymentStatus || 'awaiting_payment',
        currency: input.currency || 'EUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning();
  
  return results;
}

/**
 * Update a payment
 */
export async function updatePayment(id: number, input: UpdatePaymentInput): Promise<Payment | null> {
  const [existing] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }
  
  const [result] = await db
    .update(payments)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return result || null;
}

/**
 * Mark payment as paid
 */
export async function markPaymentAsPaid(
  id: number,
  transactionId?: string,
  receiptNumber?: string,
  gatewayResponse?: any
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentStatus: 'paid',
      paymentDate: new Date(),
      transactionId,
      receiptNumber,
      gatewayResponse,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark payment as failed
 */
export async function markPaymentAsFailed(
  id: number,
  errorMessage?: string
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentStatus: 'failed',
      errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark payment as cancelled
 */
export async function markPaymentAsCancelled(id: number): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentStatus: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark payment as refunded
 */
export async function markPaymentAsRefunded(
  id: number,
  reason?: string
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentStatus: 'refunded',
      gatewayResponse: { reason, refundedAt: new Date().toISOString() },
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update payment deadline
 */
export async function updatePaymentDeadline(
  id: number,
  deadline: Date
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentDeadline: deadline,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update payment amount
 */
export async function updatePaymentAmount(
  id: number,
  amount: number,
  currency?: string
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      amount,
      currency: currency || 'EUR',
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a payment (soft delete)
 */
export async function softDeletePayment(id: number): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      paymentStatus: 'deleted',
      amount: 0,
      transactionId: null,
      gatewayResponse: null,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a payment (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deletePayment(id: number): Promise<boolean> {
  const [result] = await db
    .delete(payments)
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk update payments
 */
export async function bulkUpdatePayments(
  ids: number[],
  updates: Partial<UpdatePaymentInput>
): Promise<number> {
  const results = await db
    .update(payments)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(...ids.map(id => eq(payments.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Record payment gateway response
 */
export async function recordGatewayResponse(
  id: number,
  response: any
): Promise<boolean> {
  const [result] = await db
    .update(payments)
    .set({
      gatewayResponse: response,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning();
  
  return !!result;
}
