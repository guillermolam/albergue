/**
 * Place Commands
 * Write operations for places (admin only — enforced at the route layer).
 */

import { db } from "../lib/db.js";
import { places, placeAddresses, placePhones } from "@albergue/domain-model";
import { eq } from "drizzle-orm";
import type { InsertPlace, Place, InsertPlaceAddress, InsertPlacePhone } from "../types/index.js";

export interface CreatePlaceInput extends InsertPlace {
  addresses?: Omit<InsertPlaceAddress, "placeId">[];
  phones?: Omit<InsertPlacePhone, "placeId">[];
}

/**
 * Creates a place, plus any given addresses/phones, in one transaction --
 * there was previously no write path for place_addresses/place_phones at
 * all (only reads joined them in), so every place created via the admin
 * API ended up with no contact details attached.
 */
export async function createPlace(input: CreatePlaceInput): Promise<Place> {
  const { addresses, phones, ...placeInput } = input;

  return db.transaction(async (tx) => {
    const [result] = await tx
      .insert(places)
      .values({ ...placeInput, createdAt: new Date(), updatedAt: new Date() })
      .returning();

    if (!result) throw new Error("Failed to create place");

    if (addresses?.length) {
      await tx.insert(placeAddresses).values(addresses.map((a) => ({ ...a, placeId: result.id })));
    }
    if (phones?.length) {
      await tx.insert(placePhones).values(phones.map((p) => ({ ...p, placeId: result.id })));
    }

    return result;
  });
}

export async function updatePlace(
  id: number,
  input: Partial<InsertPlace>,
): Promise<Place | null> {
  const [result] = await db
    .update(places)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(places.id, id))
    .returning();

  return result ?? null;
}

export async function deletePlace(id: number): Promise<boolean> {
  const [result] = await db.delete(places).where(eq(places.id, id)).returning();
  return !!result;
}
