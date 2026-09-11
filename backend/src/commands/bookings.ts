/**
 * Booking Commands
 * Write operations for bookings
 */

import { db } from '../lib/db.js';
import { bookings, beds } from '@albergue/domain-model';
import { eq, and, or, isNull, lte } from 'drizzle-orm';
import type { InsertBooking, UpdateBookingInput, Booking } from '../types/index.js';

/**
 * Create a new booking
 */
export async function createBooking(input: InsertBooking): Promise<Booking> {
  const [result] = await db
    .insert(bookings)
    .values({
      ...input,
      status: input.status || 'reserved',
      numberOfPersons: input.numberOfPersons || 1,
      numberOfRooms: input.numberOfRooms || 1,
      hasInternet: input.hasInternet || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create booking');
  }
  
  // If bedAssignmentId is provided, reserve the bed
  if (result.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: false,
        status: 'reserved',
        reservedUntil: result.reservationExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, result.bedAssignmentId));
  }
  
  return result;
}

/**
 * Create multiple bookings (batch)
 */
export async function createBookingsBatch(inputs: InsertBooking[]): Promise<Booking[]> {
  const results = await db
    .insert(bookings)
    .values(
      inputs.map(input => ({
        ...input,
        status: input.status || 'reserved',
        numberOfPersons: input.numberOfPersons || 1,
        numberOfRooms: input.numberOfRooms || 1,
        hasInternet: input.hasInternet || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
    .returning();
  
  // Reserve beds for all bookings
  for (const result of results) {
    if (result.bedAssignmentId) {
      await db
        .update(beds)
        .set({
          isAvailable: false,
          status: 'reserved',
          reservedUntil: result.reservationExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, result.bedAssignmentId));
    }
  }
  
  return results;
}

/**
 * Update a booking
 */
export async function updateBooking(id: number, input: UpdateBookingInput): Promise<Booking | null> {
  const [existing] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  
  if (!existing) {
    return null;
  }

  const {
    id: _id,
    totalAmount,
    paymentDeadline,
    reservationExpiresAt,
    ...rest
  } = input;
  
  const [result] = await db
    .update(bookings)
    .set({
      ...rest,
      ...(totalAmount !== undefined ? { totalAmount: String(totalAmount) } : {}),
      ...(paymentDeadline !== undefined ? { paymentDeadline: new Date(paymentDeadline) } : {}),
      ...(reservationExpiresAt !== undefined ? { reservationExpiresAt: new Date(reservationExpiresAt) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  return result || null;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  id: number,
  status: string
): Promise<boolean> {
  const [result] = await db
    .update(bookings)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  // If status is cancelled or completed, release the bed
  if (['cancelled', 'completed', 'checked_out'].includes(status)) {
    const [booking] = await db
      .select({ bedAssignmentId: bookings.bedAssignmentId })
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);
    
    if (booking?.bedAssignmentId) {
      await db
        .update(beds)
        .set({
          isAvailable: true,
          status: 'available',
          reservedUntil: null,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, booking.bedAssignmentId));
    }
  }
  
  return !!result;
}

/**
 * Assign bed to booking
 */
export async function assignBedToBooking(
  bookingId: number,
  bedId: number
): Promise<boolean> {
  // First, release any previously assigned bed
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  
  if (booking?.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  // Assign new bed
  const [result] = await db
    .update(bookings)
    .set({
      bedAssignmentId: bedId,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId))
    .returning();
  
  if (result) {
    await db
      .update(beds)
      .set({
        isAvailable: false,
        status: 'reserved',
        // @ts-ignore
        reservedUntil: bookings.reservationExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, bedId));
  }
  
  return !!result;
}

/**
 * Release bed from booking
 */
export async function releaseBedFromBooking(bookingId: number): Promise<boolean> {
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  
  if (!booking?.bedAssignmentId) {
    return false;
  }
  
  const [result] = await db
    .update(bookings)
    .set({
      bedAssignmentId: null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId))
    .returning();
  
  if (result) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  return !!result;
}

/**
 * Extend booking reservation
 */
export async function extendBookingReservation(
  id: number,
  newExpiration: Date
): Promise<boolean> {
  const [result] = await db
    .update(bookings)
    .set({
      reservationExpiresAt: newExpiration,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update booking payment deadline
 */
export async function updateBookingPaymentDeadline(
  id: number,
  deadline: Date
): Promise<boolean> {
  const [result] = await db
    .update(bookings)
    .set({
      paymentDeadline: deadline,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  return !!result;
}

/**
 * Update booking notes
 */
export async function updateBookingNotes(
  id: number,
  notes: string
): Promise<boolean> {
  const [result] = await db
    .update(bookings)
    .set({
      notes,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark booking as checked in
 */
export async function markBookingAsCheckedIn(id: number): Promise<boolean> {
  const [result] = await db
    .update(bookings)
    .set({
      status: 'checked_in',
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  return !!result;
}

/**
 * Mark booking as checked out
 */
export async function markBookingAsCheckedOut(id: number): Promise<boolean> {
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  
  const [result] = await db
    .update(bookings)
    .set({
      status: 'checked_out',
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  // Release the bed
  if (booking?.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        lastCleanedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  return !!result;
}

/**
 * Cancel booking
 */
export async function cancelBooking(id: number): Promise<boolean> {
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  
  const [result] = await db
    .update(bookings)
    .set({
      status: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  // Release the bed
  if (booking?.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  return !!result;
}

/**
 * Soft delete a booking
 */
export async function softDeleteBooking(id: number): Promise<boolean> {
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  
  const [result] = await db
    .update(bookings)
    .set({
      referenceNumber: `(DELETED)-${id}`,
      status: 'deleted',
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  
  // Release the bed
  if (booking?.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  return !!result;
}

/**
 * Delete a booking (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deleteBooking(id: number): Promise<boolean> {
  const [booking] = await db
    .select({ bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  
  const [result] = await db
    .delete(bookings)
    .where(eq(bookings.id, id))
    .returning();
  
  // Release the bed
  if (booking?.bedAssignmentId) {
    await db
      .update(beds)
      .set({
        isAvailable: true,
        status: 'available',
        reservedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(beds.id, booking.bedAssignmentId));
  }
  
  return !!result;
}

/**
 * Bulk update bookings
 */
export async function bulkUpdateBookings(
  ids: number[],
  updates: Partial<UpdateBookingInput>
): Promise<number> {
  const {
    id: _id,
    totalAmount,
    paymentDeadline,
    reservationExpiresAt,
    ...rest
  } = updates;

  const results = await db
    .update(bookings)
    .set({
      ...rest,
      ...(totalAmount !== undefined ? { totalAmount: String(totalAmount) } : {}),
      ...(paymentDeadline !== undefined ? { paymentDeadline: new Date(paymentDeadline) } : {}),
      ...(reservationExpiresAt !== undefined ? { reservationExpiresAt: new Date(reservationExpiresAt) } : {}),
      updatedAt: new Date(),
    })
    .where(or(...ids.map(id => eq(bookings.id, id))))
    .returning();
  
  return results.length;
}

/**
 * Cleanup expired bookings
 */
export async function cleanupExpiredBookings(): Promise<number> {
  const now = new Date();
  
  const expiredBookings = await db
    .select({ id: bookings.id, bedAssignmentId: bookings.bedAssignmentId })
    .from(bookings)
    .where(
      and(
        eq(bookings.status, 'reserved'),
        // @ts-ignore
        lte(bookings.reservationExpiresAt, now)
      )
    );
  
  let count = 0;
  
  for (const booking of expiredBookings) {
    await db
      .update(bookings)
      .set({
        status: 'expired',
        autoCleanupProcessed: true,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));
    
    if (booking.bedAssignmentId) {
      await db
        .update(beds)
        .set({
          isAvailable: true,
          status: 'available',
          reservedUntil: null,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, booking.bedAssignmentId));
    }
    
    count++;
  }
  
  return count;
}
