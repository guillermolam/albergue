/**
 * Place Commands
 * Write operations for places (admin only — enforced at the route layer).
 */

import { db } from "../lib/db.js";
import {
  places,
  placeAddresses,
  placePhones,
  placeImages,
  placeLabels,
  placePrices,
  insertPlaceAddressSchema,
  insertPlacePhoneSchema,
} from "@albergue/domain-model";
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
      // Parsed (not just cast) so a caller-supplied `id` -- or any other
      // field outside the insert schema -- can't ride along in `...a`
      // into the insert; `c.req.json<CreatePlaceInput>()` at the route
      // layer only asserts a type, it doesn't strip anything at runtime.
      await tx.insert(placeAddresses).values(
        addresses.map((a) => ({ ...insertPlaceAddressSchema.parse(a), placeId: result.id }))
      );
    }
    if (phones?.length) {
      await tx.insert(placePhones).values(
        phones.map((p) => ({ ...insertPlacePhoneSchema.parse(p), placeId: result.id }))
      );
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

/**
 * Deletes a place and its child rows (addresses, phones, images, labels,
 * prices). All five child tables' FKs are ON DELETE no action, so deleting
 * a place with any attached child row previously failed outright --
 * createPlace() had no write path for these until now, so it went
 * unnoticed, but any place with real contact details would have been
 * permanently undeletable through this route.
 */
export async function deletePlace(id: number): Promise<boolean> {
  return db.transaction(async (tx) => {
    await Promise.all([
      tx.delete(placeAddresses).where(eq(placeAddresses.placeId, id)),
      tx.delete(placePhones).where(eq(placePhones.placeId, id)),
      tx.delete(placeImages).where(eq(placeImages.placeId, id)),
      tx.delete(placeLabels).where(eq(placeLabels.placeId, id)),
      tx.delete(placePrices).where(eq(placePrices.placeId, id)),
    ]);
    const [result] = await tx.delete(places).where(eq(places.id, id)).returning();
    return !!result;
  });
}
