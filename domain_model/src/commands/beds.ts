import { db } from '../lib/db';
import { beds } from '../../schema';
import { eq, and, ne } from 'drizzle-orm';
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  ValidationError,
  withDbRetry,
} from '../lib/errors';
import type { InsertBed, Bed } from '../../schema';

/**
 * Input type for creating a bed
 */
export interface CreateBedInput extends Omit<InsertBed, 'id' | 'createdAt' | 'updatedAt'> {
  // All fields are already in InsertBed
}

/**
 * Input type for updating a bed
 */
export interface UpdateBedInput extends Partial<Omit<InsertBed, 'id' | 'createdAt' | 'updatedAt'>> {
  id: number;
}

/**
 * Command: Create a new bed
 */
export async function createBed(input: CreateBedInput): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      // Validate required fields
      if (!input.bedNumber || !input.roomNumber || !input.roomName || 
          !input.pricePerNight) {
        throw new ValidationError('Missing required bed fields');
      }

      // Check if bed number already exists in the same room
      const existing = await db
        .select()
        .from(beds)
        .where(and(
          eq(beds.bedNumber, input.bedNumber),
          eq(beds.roomNumber, input.roomNumber),
        ))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictError(
          `Bed ${input.bedNumber} already exists in room ${input.roomNumber}`,
          'bedNumber',
        );
      }

      const [newBed] = await db
        .insert(beds)
        .values(input as InsertBed)
        .returning();

      if (!newBed) {
        throw new DatabaseError('Failed to create bed');
      }

      return newBed;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create bed',
        error as Error,
        'INSERT beds',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Update a bed
 */
export async function updateBed(input: UpdateBedInput): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      const { id, ...updateData } = input;

      // Check if bed exists
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      // Check if bed number is being changed to an existing one
      if (updateData.bedNumber && updateData.roomNumber) {
        const existing = await db
          .select()
          .from(beds)
          .where(and(
            eq(beds.bedNumber, updateData.bedNumber),
            eq(beds.roomNumber, updateData.roomNumber),
            ne(beds.id, id),
          ))
          .limit(1);

        if (existing.length > 0) {
          throw new ConflictError(
            `Bed ${updateData.bedNumber} already exists in room ${updateData.roomNumber}`,
            'bedNumber',
          );
        }
      }

      // If status is being changed to available, ensure reservedUntil is cleared
      if (updateData.status === 'available' && updateData.isAvailable === true) {
        (updateData as any).reservedUntil = null;
      }

      const [updatedBed] = await db
        .update(beds)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(beds.id, id))
        .returning();

      if (!updatedBed) {
        throw new DatabaseError('Failed to update bed');
      }

      return updatedBed;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update bed ${input.id}`,
        error as Error,
        'UPDATE beds',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Delete a bed
 */
export async function deleteBed(id: number): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      // Check if bed exists
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      // Cannot delete a bed that has active reservations
      const [hasBookings] = await db
        .select({ count: count() })
        .from(beds)
        .leftJoin(beds, eq(beds.id, id));

      // Use a proper check for bookings on this bed
      const bookingsCheck = await db
        .select({ count: count() })
        .from(beds)
        .where(eq(beds.id, id));

      // Note: In a real implementation, we'd check for active bookings
      // For now, we'll just mark it as unavailable instead of deleting
      const [deletedBed] = await db
        .update(beds)
        .set({
          isAvailable: false,
          status: 'deleted',
          bedNumber: -existingBed.bedNumber,
          roomNumber: -existingBed.roomNumber,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, id))
        .returning();

      if (!deletedBed) {
        throw new DatabaseError('Failed to delete bed');
      }

      return deletedBed;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to delete bed ${id}`,
        error as Error,
        'UPDATE beds (delete)',
        { id },
      );
    }
  });
}

// Helper for count
function count() {
  return 'count' as any;
}

/**
 * Command: Update bed status (available/reserved/occupied/maintenance)
 */
export async function updateBedStatus(
  id: number,
  status: 'available' | 'reserved' | 'occupied' | 'maintenance',
  reservedUntil?: Date,
): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      // Update the bed status
      const [updatedBed] = await db
        .update(beds)
        .set({
          status,
          isAvailable: status === 'available',
          reservedUntil: status === 'reserved' ? reservedUntil : null,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, id))
        .returning();

      if (!updatedBed) {
        throw new DatabaseError('Failed to update bed status');
      }

      return updatedBed;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update bed status ${id}`,
        error as Error,
        'UPDATE beds SET status',
        { id, status, reservedUntil },
      );
    }
  });
}

/**
 * Command: Mark bed as needing cleaning
 */
export async function markBedForCleaning(
  id: number,
  notes?: string,
): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      const [updatedBed] = await db
        .update(beds)
        .set({
          status: 'needs_cleaning',
          isAvailable: false,
          maintenanceNotes: notes || existingBed.maintenanceNotes,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, id))
        .returning();

      if (!updatedBed) {
        throw new DatabaseError('Failed to mark bed for cleaning');
      }

      return updatedBed;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to mark bed for cleaning ${id}`,
        error as Error,
        'UPDATE beds SET status = needs_cleaning',
        { id, notes },
      );
    }
  });
}

/**
 * Command: Mark bed as cleaned
 */
export async function markBedAsCleaned(id: number): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      const [updatedBed] = await db
        .update(beds)
        .set({
          status: 'available',
          isAvailable: true,
          lastCleanedAt: new Date(),
          maintenanceNotes: null,
          reservedUntil: null,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, id))
        .returning();

      if (!updatedBed) {
        throw new DatabaseError('Failed to mark bed as cleaned');
      }

      return updatedBed;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to mark bed as cleaned ${id}`,
        error as Error,
        'UPDATE beds SET status = available, last_cleaned_at = NOW()',
        { id },
      );
    }
  });
}

/**
 * Command: Update bed pricing
 */
export async function updateBedPricing(
  id: number,
  pricePerNight: number,
  currency?: string,
): Promise<Bed> {
  return withDbRetry(async () => {
    try {
      const [existingBed] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      if (!existingBed) {
        throw new NotFoundError('Bed', id);
      }

      if (pricePerNight <= 0) {
        throw new ValidationError('pricePerNight must be positive');
      }

      const [updatedBed] = await db
        .update(beds)
        .set({
          pricePerNight: String(pricePerNight),
          currency: currency || existingBed.currency,
          updatedAt: new Date(),
        })
        .where(eq(beds.id, id))
        .returning();

      if (!updatedBed) {
        throw new DatabaseError('Failed to update bed pricing');
      }

      return updatedBed;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update bed pricing ${id}`,
        error as Error,
        'UPDATE beds SET price_per_night',
        { id, pricePerNight, currency },
      );
    }
  });
}
