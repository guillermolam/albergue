import { db } from '../lib/db';
import { pilgrims } from '../../schema';
import { eq, and } from 'drizzle-orm';
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  ValidationError,
  withDbRetry,
} from '../lib/errors';
import type { InsertPilgrim, Pilgrim } from '../../schema';

/**
 * Input type for creating a pilgrim
 */
export interface CreatePilgrimInput extends Omit<InsertPilgrim, 'createdAt' | 'updatedAt'> {
  // All fields are already in InsertPilgrim
}

/**
 * Input type for updating a pilgrim
 */
export interface UpdatePilgrimInput extends Partial<Omit<InsertPilgrim, 'id' | 'createdAt' | 'updatedAt'>> {
  id: number;
}

/**
 * Command: Create a new pilgrim
 */
export async function createPilgrim(input: CreatePilgrimInput): Promise<Pilgrim> {
  return withDbRetry(async () => {
    try {
      // Validate required fields
      if (!input.firstName || !input.lastName1 || !input.birthDate || 
          !input.documentType || !input.documentNumber || !input.gender || 
          !input.addressCountry || !input.addressStreet || !input.addressCity || 
          !input.addressPostalCode || !input.phone) {
        throw new ValidationError('Missing required pilgrim fields');
      }

      // Check if document number already exists
      const existing = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.documentNumber, input.documentNumber))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictError(
          `Pilgrim with document number ${input.documentNumber} already exists`,
          'documentNumber',
        );
      }

      const [newPilgrim] = await db
        .insert(pilgrims)
        .values(input as InsertPilgrim)
        .returning();

      if (!newPilgrim) {
        throw new DatabaseError('Failed to create pilgrim');
      }

      return newPilgrim;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create pilgrim',
        error as Error,
        'INSERT pilgrims',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Update a pilgrim
 */
export async function updatePilgrim(input: UpdatePilgrimInput): Promise<Pilgrim> {
  return withDbRetry(async () => {
    try {
      const { id, ...updateData } = input;

      // Check if pilgrim exists
      const existing = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new NotFoundError('Pilgrim', id);
      }

      // Check if document number is being changed to an existing one
      if (updateData.documentNumber) {
        const docCheck = await db
          .select()
          .from(pilgrims)
          .where(and(
            eq(pilgrims.documentNumber, updateData.documentNumber),
            eq(pilgrims.id, id),
          ))
          .limit(1);

        if (docCheck.length > 0) {
          throw new ConflictError(
            `Pilgrim with document number ${updateData.documentNumber} already exists`,
            'documentNumber',
          );
        }
      }

      const [updatedPilgrim] = await db
        .update(pilgrims)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(pilgrims.id, id))
        .returning();

      if (!updatedPilgrim) {
        throw new DatabaseError('Failed to update pilgrim');
      }

      return updatedPilgrim;
    } catch (error) {
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update pilgrim ${input.id}`,
        error as Error,
        'UPDATE pilgrims',
        input as Record<string, unknown>,
      );
    }
  });
}

/**
 * Command: Delete a pilgrim (soft delete pattern - mark as inactive)
 */
export async function deletePilgrim(id: number): Promise<Pilgrim> {
  return withDbRetry(async () => {
    try {
      // First check if pilgrim exists
      const existing = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new NotFoundError('Pilgrim', id);
      }

      // Note: We don't actually delete due to data retention requirements
      // Instead, we mark as inactive by updating consent
      const [deletedPilgrim] = await db
        .update(pilgrims)
        .set({
          consentGiven: false,
          dataRetentionUntil: new Date(), // Expire immediately
          updatedAt: new Date(),
        })
        .where(eq(pilgrims.id, id))
        .returning();

      if (!deletedPilgrim) {
        throw new DatabaseError('Failed to delete pilgrim');
      }

      return deletedPilgrim;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to delete pilgrim ${id}`,
        error as Error,
        'UPDATE pilgrims (delete)',
        { id },
      );
    }
  });
}

/**
 * Command: Create multiple pilgrims in a batch
 */
export async function createPilgrimsBatch(inputs: CreatePilgrimInput[]): Promise<Pilgrim[]> {
  return withDbRetry(async () => {
    try {
      if (inputs.length === 0) {
        return [];
      }

      // Validate all inputs
      for (const input of inputs) {
        if (!input.firstName || !input.lastName1 || !input.birthDate || 
            !input.documentType || !input.documentNumber || !input.gender || 
            !input.addressCountry || !input.addressStreet || !input.addressCity || 
            !input.addressPostalCode || !input.phone) {
          throw new ValidationError('Missing required pilgrim fields in batch');
        }
      }

      // Check for duplicate document numbers in the batch
      const docNumbers = inputs.map(i => i.documentNumber);
      const uniqueDocNumbers = new Set(docNumbers);
      if (docNumbers.length !== uniqueDocNumbers.size) {
        throw new ConflictError('Duplicate document numbers in batch', 'documentNumber');
      }

      // Check for existing document numbers
      const existing = await db
        .select({ documentNumber: pilgrims.documentNumber })
        .from(pilgrims)
        .where(and(...docNumbers.map(dn => eq(pilgrims.documentNumber, dn))));

      if (existing.length > 0) {
        const existingDocs = existing.map(e => e.documentNumber);
        throw new ConflictError(
          `Pilgrims with document numbers ${existingDocs.join(', ')} already exist`,
          'documentNumber',
        );
      }

      const newPilgrims = await db
        .insert(pilgrims)
        .values(inputs as InsertPilgrim[])
        .returning();

      return newPilgrims;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create pilgrims batch',
        error as Error,
        'INSERT pilgrims (batch)',
        { count: inputs.length },
      );
    }
  });
}
