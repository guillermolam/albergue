/**
 * Booking Commands
 * Write operations for bookings
 */

import { db } from "../lib/db.js";
import { bookings, beds } from "@albergue/domain-model";
import { eq, and, lte, inArray } from "drizzle-orm";
import type {
  InsertBooking,
  UpdateBookingInput,
  Booking,
} from "../types/index.js";

/**
 * Create a new booking
 */
export async function createBooking(input: InsertBooking): Promise<Booking> {
  return db.transaction(async (tx) => {
    const now = new Date();
    if (input.bedAssignmentId) {
      const [claimedBed] = await tx
        .update(beds)
        .set({
          isAvailable: false,
          status: "reserved",
          reservedUntil: input.reservationExpiresAt,
          updatedAt: now,
        })
        .where(
          and(eq(beds.id, input.bedAssignmentId), eq(beds.isAvailable, true)),
        )
        .returning({ id: beds.id });

      if (!claimedBed) {
        throw new Error(`Bed ${input.bedAssignmentId} is unavailable`);
      }
    }

    const [result] = await tx
      .insert(bookings)
      .values({
        ...input,
        status: input.status || "reserved",
        numberOfPersons: input.numberOfPersons || 1,
        numberOfRooms: input.numberOfRooms || 1,
        hasInternet: input.hasInternet || false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!result) throw new Error("Failed to create booking");
    return result;
  });
}

/**
 * Create multiple bookings (batch)
 */
export async function createBookingsBatch(
  inputs: InsertBooking[],
): Promise<Booking[]> {
  const bedIds = inputs.flatMap((input) =>
    input.bedAssignmentId ? [input.bedAssignmentId] : [],
  );
  if (new Set(bedIds).size !== bedIds.length) {
    throw new Error(
      "A bed cannot be assigned to more than one booking in a batch",
    );
  }
  if (inputs.length === 0) return [];

  return db.transaction(async (tx) => {
    const now = new Date();
    for (const input of inputs) {
      if (!input.bedAssignmentId) continue;
      const [claimedBed] = await tx
        .update(beds)
        .set({
          isAvailable: false,
          status: "reserved",
          reservedUntil: input.reservationExpiresAt,
          updatedAt: now,
        })
        .where(
          and(eq(beds.id, input.bedAssignmentId), eq(beds.isAvailable, true)),
        )
        .returning({ id: beds.id });
      if (!claimedBed)
        throw new Error(`Bed ${input.bedAssignmentId} is unavailable`);
    }

    return tx
      .insert(bookings)
      .values(
        inputs.map((input) => ({
          ...input,
          status: input.status || "reserved",
          numberOfPersons: input.numberOfPersons || 1,
          numberOfRooms: input.numberOfRooms || 1,
          hasInternet: input.hasInternet || false,
          createdAt: now,
          updatedAt: now,
        })),
      )
      .returning();
  });
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: number,
  input: UpdateBookingInput,
): Promise<Booking | null> {
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
      ...(totalAmount !== undefined
        ? { totalAmount: String(totalAmount) }
        : {}),
      ...(paymentDeadline !== undefined
        ? { paymentDeadline: new Date(paymentDeadline) }
        : {}),
      ...(reservationExpiresAt !== undefined
        ? { reservationExpiresAt: new Date(reservationExpiresAt) }
        : {}),
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
  status: string,
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
  if (["cancelled", "completed", "checked_out"].includes(status)) {
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
          status: "available",
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
  bedId: number,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [booking] = await tx
      .select({
        bedAssignmentId: bookings.bedAssignmentId,
        reservationExpiresAt: bookings.reservationExpiresAt,
      })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
    if (!booking) return false;
    if (booking.bedAssignmentId === bedId) return true;

    const now = new Date();
    const [claimedBed] = await tx
      .update(beds)
      .set({
        isAvailable: false,
        status: "reserved",
        reservedUntil: booking.reservationExpiresAt,
        updatedAt: now,
      })
      .where(and(eq(beds.id, bedId), eq(beds.isAvailable, true)))
      .returning({ id: beds.id });
    if (!claimedBed) return false;

    const [result] = await tx
      .update(bookings)
      .set({ bedAssignmentId: bedId, updatedAt: now })
      .where(eq(bookings.id, bookingId))
      .returning();
    if (!result)
      throw new Error(`Booking ${bookingId} disappeared during bed assignment`);

    if (booking.bedAssignmentId) {
      await tx
        .update(beds)
        .set({
          isAvailable: true,
          status: "available",
          reservedUntil: null,
          updatedAt: now,
        })
        .where(eq(beds.id, booking.bedAssignmentId));
    }
    return true;
  });
}

/**
 * Release bed from booking
 */
export async function releaseBedFromBooking(
  bookingId: number,
): Promise<boolean> {
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
        status: "available",
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
  newExpiration: Date,
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
  deadline: Date,
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
  notes: string,
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
      status: "checked_in",
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
      status: "checked_out",
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
        status: "available",
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
      status: "cancelled",
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
        status: "available",
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
      status: "deleted",
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
        status: "available",
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
        status: "available",
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
  updates: Partial<UpdateBookingInput>,
): Promise<number> {
  if (ids.length === 0) return 0;
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
      ...(totalAmount !== undefined
        ? { totalAmount: String(totalAmount) }
        : {}),
      ...(paymentDeadline !== undefined
        ? { paymentDeadline: new Date(paymentDeadline) }
        : {}),
      ...(reservationExpiresAt !== undefined
        ? { reservationExpiresAt: new Date(reservationExpiresAt) }
        : {}),
      updatedAt: new Date(),
    })
    .where(inArray(bookings.id, ids))
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
        eq(bookings.status, "reserved"),
        // @ts-ignore
        lte(bookings.reservationExpiresAt, now),
      ),
    );

  let count = 0;

  for (const booking of expiredBookings) {
    await db
      .update(bookings)
      .set({
        status: "expired",
        autoCleanupProcessed: true,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    if (booking.bedAssignmentId) {
      await db
        .update(beds)
        .set({
          isAvailable: true,
          status: "available",
          reservedUntil: null,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, booking.bedAssignmentId));
    }

    count++;
  }

  return count;
}
