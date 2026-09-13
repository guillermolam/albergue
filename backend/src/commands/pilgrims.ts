/**
 * Pilgrim Commands
 * Write operations for pilgrims
 */

import { db } from '../lib/db.js';
import { pilgrims } from '@albergue/domain-model';
import { eq, and, lte } from 'drizzle-orm';
import type { InsertPilgrim, UpdatePilgrimInput, Pilgrim } from '../types/index.js';

/**
 * Create a new pilgrim
 * Only allows setting safe, user-modifiable fields
 */
export async function createPilgrim(input: InsertPilgrim): Promise<Pilgrim> {
  // Whitelist of fields that can be set during creation
  // Excludes server-controlled fields (id, createdAt, updatedAt, lastAccessDate)
  const allowedFields: Partial<InsertPilgrim> = {
    firstName: input.firstName || '',
    lastName1: input.lastName1 || '',
  };
  
  if (input.lastName2 !== undefined) allowedFields.lastName2 = input.lastName2;
  if (input.birthDate !== undefined) allowedFields.birthDate = input.birthDate;
  if (input.documentType !== undefined) allowedFields.documentType = input.documentType;
  if (input.documentNumber !== undefined) allowedFields.documentNumber = input.documentNumber;
  if (input.documentSupport !== undefined) allowedFields.documentSupport = input.documentSupport;
  if (input.gender !== undefined) allowedFields.gender = input.gender;
  if (input.nationality !== undefined) allowedFields.nationality = input.nationality;
  if (input.phone !== undefined) allowedFields.phone = input.phone;
  if (input.email !== undefined) allowedFields.email = input.email;
  if (input.addressCountry !== undefined) allowedFields.addressCountry = input.addressCountry;
  if (input.addressStreet !== undefined) allowedFields.addressStreet = input.addressStreet;
  if (input.addressStreet2 !== undefined) allowedFields.addressStreet2 = input.addressStreet2;
  if (input.addressCity !== undefined) allowedFields.addressCity = input.addressCity;
  if (input.addressPostalCode !== undefined) allowedFields.addressPostalCode = input.addressPostalCode;
  if (input.addressProvince !== undefined) allowedFields.addressProvince = input.addressProvince;
  if (input.addressMunicipalityCode !== undefined) allowedFields.addressMunicipalityCode = input.addressMunicipalityCode;
  if (input.idPhotoUrl !== undefined) allowedFields.idPhotoUrl = input.idPhotoUrl;
  if (input.language !== undefined) allowedFields.language = input.language;
  if (input.consentGiven !== undefined) allowedFields.consentGiven = input.consentGiven;

  const [result] = await db
    .insert(pilgrims)
    .values({
      ...allowedFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result) {
    throw new Error('Failed to create pilgrim');
  }

  return result;
}

/**
 * Create multiple pilgrims (batch)
 * Only allows setting safe, user-modifiable fields
 */
export async function createPilgrimsBatch(inputs: InsertPilgrim[]): Promise<Pilgrim[]> {
  // Apply field whitelisting to each input
  const sanitizedInputs = inputs.map(input => {
    const allowedFields: Partial<InsertPilgrim> = {
      firstName: input.firstName || '',
      lastName1: input.lastName1 || '',
    };
    
    if (input.lastName2 !== undefined) allowedFields.lastName2 = input.lastName2;
    if (input.birthDate !== undefined) allowedFields.birthDate = input.birthDate;
    if (input.documentType !== undefined) allowedFields.documentType = input.documentType;
    if (input.documentNumber !== undefined) allowedFields.documentNumber = input.documentNumber;
    if (input.documentSupport !== undefined) allowedFields.documentSupport = input.documentSupport;
    if (input.gender !== undefined) allowedFields.gender = input.gender;
    if (input.nationality !== undefined) allowedFields.nationality = input.nationality;
    if (input.phone !== undefined) allowedFields.phone = input.phone;
    if (input.email !== undefined) allowedFields.email = input.email;
    if (input.addressCountry !== undefined) allowedFields.addressCountry = input.addressCountry;
    if (input.addressStreet !== undefined) allowedFields.addressStreet = input.addressStreet;
    if (input.addressStreet2 !== undefined) allowedFields.addressStreet2 = input.addressStreet2;
    if (input.addressCity !== undefined) allowedFields.addressCity = input.addressCity;
    if (input.addressPostalCode !== undefined) allowedFields.addressPostalCode = input.addressPostalCode;
    if (input.addressProvince !== undefined) allowedFields.addressProvince = input.addressProvince;
    if (input.addressMunicipalityCode !== undefined) allowedFields.addressMunicipalityCode = input.addressMunicipalityCode;
    if (input.idPhotoUrl !== undefined) allowedFields.idPhotoUrl = input.idPhotoUrl;
    if (input.language !== undefined) allowedFields.language = input.language;
    if (input.consentGiven !== undefined) allowedFields.consentGiven = input.consentGiven;

    return {
      ...allowedFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const results = await db
    .insert(pilgrims)
    .values(sanitizedInputs)
    .returning();

  return results;
}

/**
 * Update a pilgrim
 * Only allows updating safe, user-modifiable fields
 */
export async function updatePilgrim(id: number, input: UpdatePilgrimInput): Promise<Pilgrim | null> {
  const [existing] = await db
    .select()
    .from(pilgrims)
    .where(eq(pilgrims.id, id))
    .limit(1);

  if (!existing) {
    return null;
  }

  // Whitelist of fields that can be updated by users
  // Excludes server-controlled fields (id, createdAt, updatedAt, consentGiven, consentDate, dataRetentionUntil, lastAccessDate)
  const allowedFields: Partial<UpdatePilgrimInput> = {};
  
  if (input.firstName !== undefined) allowedFields.firstName = input.firstName;
  if (input.lastName1 !== undefined) allowedFields.lastName1 = input.lastName1;
  if (input.lastName2 !== undefined) allowedFields.lastName2 = input.lastName2;
  if (input.birthDate !== undefined) allowedFields.birthDate = input.birthDate;
  if (input.documentType !== undefined) allowedFields.documentType = input.documentType;
  if (input.documentNumber !== undefined) allowedFields.documentNumber = input.documentNumber;
  if (input.documentSupport !== undefined) allowedFields.documentSupport = input.documentSupport;
  if (input.gender !== undefined) allowedFields.gender = input.gender;
  if (input.nationality !== undefined) allowedFields.nationality = input.nationality;
  if (input.phone !== undefined) allowedFields.phone = input.phone;
  if (input.email !== undefined) allowedFields.email = input.email;
  if (input.addressCountry !== undefined) allowedFields.addressCountry = input.addressCountry;
  if (input.addressStreet !== undefined) allowedFields.addressStreet = input.addressStreet;
  if (input.addressStreet2 !== undefined) allowedFields.addressStreet2 = input.addressStreet2;
  if (input.addressCity !== undefined) allowedFields.addressCity = input.addressCity;
  if (input.addressPostalCode !== undefined) allowedFields.addressPostalCode = input.addressPostalCode;
  if (input.addressProvince !== undefined) allowedFields.addressProvince = input.addressProvince;
  if (input.addressMunicipalityCode !== undefined) allowedFields.addressMunicipalityCode = input.addressMunicipalityCode;
  if (input.idPhotoUrl !== undefined) allowedFields.idPhotoUrl = input.idPhotoUrl;
  if (input.language !== undefined) allowedFields.language = input.language;

  const [result] = await db
    .update(pilgrims)
    .set({
      ...allowedFields,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return result || null;
}

/**
 * Delete a pilgrim (soft delete - mark as inactive)
 * Note: We don't hard delete to preserve data integrity
 */
export async function softDeletePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      // Mark fields that indicate deletion
      firstName: '(DELETED)',
      lastName1: '(DELETED)',
      email: null, // nullable column — null marks erased data
      phone: '(DELETED)', // NOT NULL column — tombstone marker, not ''
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Delete a pilgrim (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deletePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .delete(pilgrims)
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Deactivate a pilgrim (set consent to false)
 */
export async function deactivatePilgrim(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      consentGiven: false,
      consentDate: null,
      dataRetentionUntil: new Date(), // Expire data immediately
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's last access date
 */
export async function updatePilgrimLastAccess(id: number): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      lastAccessDate: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's language preference
 */
export async function updatePilgrimLanguage(id: number, language: string): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      language,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Update pilgrim's document information
 */
export async function updatePilgrimDocument(
  id: number,
  documentInfo: {
    documentType?: string;
    documentNumber?: string;
    documentSupport?: string;
  }
): Promise<boolean> {
  const [result] = await db
    .update(pilgrims)
    .set({
      ...documentInfo,
      updatedAt: new Date(),
    })
    .where(eq(pilgrims.id, id))
    .returning();

  return !!result;
}

/**
 * Bulk update pilgrims
 * Only allows updating safe, user-modifiable fields
 */
export async function bulkUpdatePilgrims(
  ids: number[],
  updates: Partial<UpdatePilgrimInput>
): Promise<number> {
  // Whitelist of fields that can be updated by users
  // Excludes server-controlled fields (id, createdAt, updatedAt, consentGiven, consentDate, dataRetentionUntil, lastAccessDate)
  const allowedFields: Partial<UpdatePilgrimInput> = {};
  
  if (updates.firstName !== undefined) allowedFields.firstName = updates.firstName;
  if (updates.lastName1 !== undefined) allowedFields.lastName1 = updates.lastName1;
  if (updates.lastName2 !== undefined) allowedFields.lastName2 = updates.lastName2;
  if (updates.birthDate !== undefined) allowedFields.birthDate = updates.birthDate;
  if (updates.documentType !== undefined) allowedFields.documentType = updates.documentType;
  if (updates.documentNumber !== undefined) allowedFields.documentNumber = updates.documentNumber;
  if (updates.documentSupport !== undefined) allowedFields.documentSupport = updates.documentSupport;
  if (updates.gender !== undefined) allowedFields.gender = updates.gender;
  if (updates.nationality !== undefined) allowedFields.nationality = updates.nationality;
  if (updates.phone !== undefined) allowedFields.phone = updates.phone;
  if (updates.email !== undefined) allowedFields.email = updates.email;
  if (updates.addressCountry !== undefined) allowedFields.addressCountry = updates.addressCountry;
  if (updates.addressStreet !== undefined) allowedFields.addressStreet = updates.addressStreet;
  if (updates.addressStreet2 !== undefined) allowedFields.addressStreet2 = updates.addressStreet2;
  if (updates.addressCity !== undefined) allowedFields.addressCity = updates.addressCity;
  if (updates.addressPostalCode !== undefined) allowedFields.addressPostalCode = updates.addressPostalCode;
  if (updates.addressProvince !== undefined) allowedFields.addressProvince = updates.addressProvince;
  if (updates.addressMunicipalityCode !== undefined) allowedFields.addressMunicipalityCode = updates.addressMunicipalityCode;
  if (updates.idPhotoUrl !== undefined) allowedFields.idPhotoUrl = updates.idPhotoUrl;
  if (updates.language !== undefined) allowedFields.language = updates.language;

  const results = await db
    .update(pilgrims)
    .set({
      ...allowedFields,
      updatedAt: new Date(),
    })
    .where(and(
      // @ts-ignore
      inArray(pilgrims.id, ids)
    ))
    .returning();

  return results.length;
}

/**
 * Cleanup old pilgrim records
 * Removes pilgrims with expired data retention
 */
export async function cleanupExpiredPilgrims(): Promise<number> {
  const now = new Date();

  const results = await db
    .delete(pilgrims)
    .where(
      and(
        eq(pilgrims.consentGiven, false),
        lte(pilgrims.dataRetentionUntil, now)
      )
    )
    .returning();

  // Return count of deleted records
  return results.length;
}
