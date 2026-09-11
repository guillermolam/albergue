import { db } from '../lib/db';
import { bookings, beds, pilgrims, payments } from '../../schema';
import { eq, and, or, ne, lt, gt, gte, lte, isNull, not, desc } from 'drizzle-orm';
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  ValidationError,
  withDbRetry,
} from '../lib/errors';
import type { InsertBooking, Booking, Bed, Pilgrim } from '../../schema';

/**
 * Input type for creating a booking
 */
export interface CreateBookingInput extends Omit<InsertBooking, 'id' | 'createdAt' | 'updatedAt' | 'referenceNumber'> {
  pilgrimId: number;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  totalAmount: number;
}

/**
 * Input type for updating a booking
 */
export interface UpdateBookingInput extends Partial<Omit<InsertBooking, 'id' | 'createdAt' | 'updatedAt' | 'referenceNumber'>> {
  id: number;
}

/**
 * Status types for bookings
 */
export type BookingStatus = 'reserved' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show' | 'expired';

/**
 * Generate a unique reference number for a booking
 */
function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BKG-${timestamp}-${random}`.toUpperCase();
}

/**
 * Command: Create a new booking
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  return withDbRetry(async () => {
    try {
      // Validate required fields
      if (!input.pilgrimId || !input.checkInDate || !input.checkOutDate || 
          !input.numberOfNights || !input.totalAmount) {
        throw new ValidationError('Missing required booking fields');
      }

      // Validate dates
      const checkIn = new Date(input.checkInDate);
      const checkOut = new Date(input.checkOutDate);
      const now = new Date();

      if (checkIn >= checkOut) {
        throw new ValidationError('checkInDate must be before checkOutDate');
      }

      if (checkIn < now) {
        throw new ValidationError('checkInDate cannot be in the past');
      }

      // Validate number of nights matches dates
      const calculatedNights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (input.numberOfNights !== calculatedNights) {
        throw new ValidationError(
          `numberOfNights (${input.numberOfNights}) does not match date range (${calculatedNights})`
        );
      }

      // Check if pilgrim exists
      const [pilgrim] = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, input.pilgrimId))
        .limit(1);

      if (!pilgrim) {
        throw new NotFoundError('Pilgrim', input.pilgrimId);
      }

      // Check if pilgrim has consent
      if (!pilgrim.consentGiven) {
        throw new ValidationError('Pilgrim has not given consent');
      }

      // Check for existing bookings that overlap with this one for the same pilgrim
      const overlappingBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.pilgrimId, input.pilgrimId),
            or(
              and(
                lte(bookings.checkInDate, checkIn),
                gt(bookings.checkOutDate, checkIn),
              ), // Existing booking starts before and ends after new start
              and(
                lte(bookings.checkInDate, checkOut),
                gt(bookings.checkOutDate, checkOut),
              ), // Existing booking starts before and ends after new end
              and(
                gte(bookings.checkInDate, checkIn),
                lte(bookings.checkOutDate, checkOut),
              ), // Existing booking is completely within new range
            ),
            ne(bookings.status, 'cancelled'),
            ne(bookings.status, 'no_show'),
          ),
        );

      if (overlappingBookings.length > 0) {
        throw new ConflictError(
          `Pilgrim already has a booking during the selected dates`,
          'checkInDate',
        );
      }

      // Check bed availability if bedAssignmentId is provided
      if (input.bedAssignmentId) {
        const [bed] = await db
          .select()
          .from(beds)
          .where(eq(beds.id, input.bedAssignmentId))
          .limit(1);

        if (!bed) {
          throw new NotFoundError('Bed', input.bedAssignmentId);
        }

        if (!bed.isAvailable) {
          throw new ConflictError('Selected bed is not available', 'bedAssignmentId');
        }

        // Check for existing bookings on the same bed during the date range
        const bedBookings = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.bedAssignmentId, input.bedAssignmentId),
              or(
                and(
                  lte(bookings.checkInDate, checkIn),
                  gt(bookings.checkOutDate, checkIn),
                ),
                and(
                  lte(bookings.checkInDate, checkOut),
                  gt(bookings.checkOutDate, checkOut),
                ),
                and(
                  gte(bookings.checkInDate, checkIn),
                  lte(bookings.checkOutDate, checkOut),
                ),
              ),
              ne(bookings.status, 'cancelled'),
              ne(bookings.status, 'no_show'),
            ),
          );

        if (bedBookings.length > 0) {
          throw new ConflictError(
            `Bed ${input.bedAssignmentId} is already reserved during the selected dates`,
            'bedAssignmentId',
          );
        }
      }

      // Generate unique reference number
      let referenceNumber: string;
      let attempt = 0;
      const maxAttempts = 5;

      do {
        referenceNumber = generateReferenceNumber();
        const [existing] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.referenceNumber, referenceNumber))
          .limit(1);

        if (!existing) break;
        attempt++;
      } while (attempt < maxAttempts);

      if (attempt >= maxAttempts) {
        throw new DatabaseError('Failed to generate unique reference number');
      }

      // Calculate reservation expiry (24 hours from now)
      const reservationExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const paymentDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const [newBooking] = await db
        .insert(bookings)
        .values({
          ...input,
          referenceNumber,
          status: 'reserved',
          reservationExpiresAt,
          paymentDeadline,
        } as InsertBooking)
        .returning();

      if (!newBooking) {
        throw new DatabaseError('Failed to create booking');
      }

      // If a bed was assigned, mark it as unavailable
      if (input.bedAssignmentId) {
        await db
          .update(beds)
          .set({
            isAvailable: false,
            status: 'reserved',
            reservedUntil: newBooking.checkOutDate,
            updatedAt: new Date(),
          })
          .where(eq(beds.id, input.bedAssignmentId));
      }

      return newBooking;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create booking',
        error as Error,
        'INSERT bookings',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Update a booking
 */
export async function updateBooking(input: UpdateBookingInput): Promise<Booking> {
  return withDbRetry(async () => {
    try {
      const { id, ...updateData } = input;

      // Get existing booking
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      // Validate status transition
      if (updateData.status) {
        const validTransitions: Record<BookingStatus, BookingStatus[]> = {
          reserved: ['confirmed', 'cancelled', 'expired'],
          confirmed: ['checked_in', 'checked_out', 'cancelled', 'no_show'],
          checked_in: ['checked_out', 'no_show'],
          checked_out: [],
          cancelled: [],
          no_show: [],
          expired: ['reserved', 'confirmed'],
        };

        const currentStatus = existingBooking.status as BookingStatus;
        const newStatus = updateData.status as BookingStatus;

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
          throw new ValidationError(
            `Cannot transition from ${currentStatus} to ${newStatus}`
          );
        }
      }

      // Handle bed assignment changes
      if (updateData.bedAssignmentId && 
          updateData.bedAssignmentId !== existingBooking.bedAssignmentId) {
        
        const newBedId = updateData.bedAssignmentId;

        // Check if new bed exists and is available
        const [newBed] = await db
          .select()
          .from(beds)
          .where(eq(beds.id, newBedId))
          .limit(1);

        if (!newBed) {
          throw new NotFoundError('Bed', newBedId);
        }

        if (!newBed.isAvailable) {
          throw new ConflictError('Selected bed is not available', 'bedAssignmentId');
        }

        // Check for conflicts on the new bed
        const checkIn = existingBooking.checkInDate;
        const checkOut = existingBooking.checkOutDate;

        const bedBookings = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.bedAssignmentId, newBedId),
              ne(bookings.id, id),
              or(
                and(lte(bookings.checkInDate, checkIn), gt(bookings.checkOutDate, checkIn)),
                and(lte(bookings.checkInDate, checkOut), gt(bookings.checkOutDate, checkOut)),
                and(gte(bookings.checkInDate, checkIn), lte(bookings.checkOutDate, checkOut)),
              ),
              ne(bookings.status, 'cancelled'),
              ne(bookings.status, 'no_show'),
            ),
          );

        if (bedBookings.length > 0) {
          throw new ConflictError(
            `Bed ${newBedId} is already reserved during the selected dates`,
            'bedAssignmentId',
          );
        }

        // Release old bed if it existed
        if (existingBooking.bedAssignmentId) {
          await db
            .update(beds)
            .set({
              isAvailable: true,
              status: 'available',
              reservedUntil: null,
              updatedAt: new Date(),
            })
            .where(eq(beds.id, existingBooking.bedAssignmentId));
        }

        // Reserve new bed
        await db
          .update(beds)
          .set({
            isAvailable: false,
            status: 'reserved',
            reservedUntil: checkOut,
            updatedAt: new Date(),
          })
          .where(eq(beds.id, newBedId));
      }

      // Handle date changes
      if (updateData.checkInDate || updateData.checkOutDate) {
        const newCheckIn = updateData.checkInDate ? new Date(updateData.checkInDate) : existingBooking.checkInDate;
        const newCheckOut = updateData.checkOutDate ? new Date(updateData.checkOutDate) : existingBooking.checkOutDate;

        if (newCheckIn >= newCheckOut) {
          throw new ValidationError('checkInDate must be before checkOutDate');
        }

        // Recalculate number of nights if not explicitly set
        if (!updateData.numberOfNights) {
          const calculatedNights = Math.ceil(
            (newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24)
          );
          (updateData as any).numberOfNights = calculatedNights;
        }

        // Update bed reservation dates if bed is assigned
        if (existingBooking.bedAssignmentId) {
          await db
            .update(beds)
            .set({
              reservedUntil: newCheckOut,
              updatedAt: new Date(),
            })
            .where(eq(beds.id, existingBooking.bedAssignmentId));
        }
      }

      // Update the booking
      const [updatedBooking] = await db
        .update(bookings)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(bookings.id, id))
        .returning();

      if (!updatedBooking) {
        throw new DatabaseError('Failed to update booking');
      }

      return updatedBooking;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update booking ${input.id}`,
        error as Error,
        'UPDATE bookings',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Cancel a booking
 */
export async function cancelBooking(
  id: number,
  reason?: string,
): Promise<Booking> {
  return withDbRetry(async () => {
    try {
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      // Cannot cancel already completed bookings
      if (['checked_out', 'no_show'].includes(existingBooking.status)) {
        throw new ValidationError(`Cannot cancel booking with status ${existingBooking.status}`);
      }

      // Release the bed if assigned
      if (existingBooking.bedAssignmentId) {
        await db
          .update(beds)
          .set({
            isAvailable: true,
            status: 'available',
            reservedUntil: null,
            updatedAt: new Date(),
          })
          .where(eq(beds.id, existingBooking.bedAssignmentId));
      }

      const [cancelledBooking] = await db
        .update(bookings)
        .set({
          status: 'cancelled',
          notes: reason ? `${existingBooking.notes || ''} Cancelled: ${reason}` : existingBooking.notes,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();

      if (!cancelledBooking) {
        throw new DatabaseError('Failed to cancel booking');
      }

      return cancelledBooking;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to cancel booking ${id}`,
        error as Error,
        'UPDATE bookings SET status = cancelled',
        { id, reason },
      );
    }
  });
}

/**
 * Command: Confirm a booking (mark as confirmed and create payment record)
 */
export async function confirmBooking(
  id: number,
  paymentAmount?: number,
): Promise<{ booking: Booking; payment?: any }> {
  return withDbRetry(async () => {
    try {
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      // Validate transition
      if (!['reserved'].includes(existingBooking.status)) {
        throw new ValidationError(
          `Cannot confirm booking with status ${existingBooking.status}`
        );
      }

      // Mark booking as confirmed
      const [confirmedBooking] = await db
        .update(bookings)
        .set({
          status: 'confirmed',
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id))
        .returning();

      if (!confirmedBooking) {
        throw new DatabaseError('Failed to confirm booking');
      }

      let payment: any | undefined;

      // Create payment record if amount is provided
      if (paymentAmount) {
        const amount = Math.min(paymentAmount, confirmedBooking.totalAmount);
        const paymentDeadline = new Date(confirmedBooking.paymentDeadline);

        [payment] = await db
          .insert(payments)
          .values({
            bookingId: confirmedBooking.id,
            amount: String(amount),
            paymentType: 'advance',
            paymentStatus: amount >= confirmedBooking.totalAmount ? 'paid' : 'partial',
            currency: confirmedBooking.currency,
            paymentDeadline,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        // Update booking payment status
        if (amount >= confirmedBooking.totalAmount) {
          await db
            .update(bookings)
            .set({ paymentStatus: 'paid' })
            .where(eq(bookings.id, id));
        } else {
          await db
            .update(bookings)
            .set({ paymentStatus: 'partial' })
            .where(eq(bookings.id, id));
        }
      }

      return { booking: confirmedBooking, payment };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to confirm booking ${id}`,
        error as Error,
        'UPDATE bookings SET status = confirmed',
        { id, paymentAmount },
      );
    }
  });
}

/**
 * Command: Check in a pilgrim
 */
export async function checkInPilgrim(
  bookingId: number,
  actualArrivalTime?: string,
): Promise<{ booking: Booking; pilgrim: Pilgrim }> {
  return withDbRetry(async () => {
    try {
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (!existingBooking) {
        throw new NotFoundError('Booking', bookingId);
      }

      // Validate transition
      if (!['confirmed', 'reserved'].includes(existingBooking.status)) {
        throw new ValidationError(
          `Cannot check in booking with status ${existingBooking.status}`
        );
      }

      // Get pilgrim
      const [pilgrim] = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, existingBooking.pilgrimId))
        .limit(1);

      if (!pilgrim) {
        throw new NotFoundError('Pilgrim', existingBooking.pilgrimId);
      }

      // Check in the pilgrim
      const [checkedInBooking] = await db
        .update(bookings)
        .set({
          status: 'checked_in',
          estimatedArrivalTime: actualArrivalTime || existingBooking.estimatedArrivalTime,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      if (!checkedInBooking) {
        throw new DatabaseError('Failed to check in pilgrim');
      }

      // Mark bed as occupied if assigned
      if (checkedInBooking.bedAssignmentId) {
        await db
          .update(beds)
          .set({
            status: 'occupied',
            updatedAt: new Date(),
          })
          .where(eq(beds.id, checkedInBooking.bedAssignmentId));
      }

      // Update pilgrim's last access date
      await db
        .update(pilgrims)
        .set({ lastAccessDate: new Date() })
        .where(eq(pilgrims.id, pilgrim.id));

      return { booking: checkedInBooking, pilgrim };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to check in pilgrim for booking ${bookingId}`,
        error as Error,
        'UPDATE bookings SET status = checked_in',
        { bookingId, actualArrivalTime },
      );
    }
  });
}

/**
 * Command: Check out a pilgrim
 */
export async function checkOutPilgrim(
  bookingId: number,
): Promise<{ booking: Booking; pilgrim: Pilgrim; bed?: Bed }> {
  return withDbRetry(async () => {
    try {
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1);

      if (!existingBooking) {
        throw new NotFoundError('Booking', bookingId);
      }

      // Validate transition
      if (!['checked_in'].includes(existingBooking.status)) {
        throw new ValidationError(
          `Cannot check out booking with status ${existingBooking.status}`
        );
      }

      // Get pilgrim
      const [pilgrim] = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, existingBooking.pilgrimId))
        .limit(1);

      if (!pilgrim) {
        throw new NotFoundError('Pilgrim', existingBooking.pilgrimId);
      }

      // Get bed if assigned
      let bed: Bed | undefined;
      if (existingBooking.bedAssignmentId) {
        [bed] = await db
          .select()
          .from(beds)
          .where(eq(beds.id, existingBooking.bedAssignmentId))
          .limit(1);
      }

      // Check out the pilgrim
      const [checkedOutBooking] = await db
        .update(bookings)
        .set({
          status: 'checked_out',
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      if (!checkedOutBooking) {
        throw new DatabaseError('Failed to check out pilgrim');
      }

      // Mark bed as available again
      if (existingBooking.bedAssignmentId) {
        await db
          .update(beds)
          .set({
            isAvailable: true,
            status: 'available',
            reservedUntil: null,
            lastCleanedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(beds.id, existingBooking.bedAssignmentId));
      }

      // Update pilgrim's last access date
      await db
        .update(pilgrims)
        .set({ lastAccessDate: new Date() })
        .where(eq(pilgrims.id, pilgrim.id));

      return { booking: checkedOutBooking, pilgrim, bed };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to check out pilgrim for booking ${bookingId}`,
        error as Error,
        'UPDATE bookings SET status = checked_out',
        { bookingId },
      );
    }
  });
}
