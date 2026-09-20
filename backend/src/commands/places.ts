/**
 * Place Commands
 * Write operations for places (admin only — enforced at the route layer).
 */

import { db } from "../lib/db.js";
import { places } from "@albergue/domain-model";
import { eq } from "drizzle-orm";
import type { InsertPlace, Place } from "../types/index.js";

export async function createPlace(input: InsertPlace): Promise<Place> {
  const [result] = await db
    .insert(places)
    .values({ ...input, createdAt: new Date(), updatedAt: new Date() })
    .returning();

  if (!result) throw new Error("Failed to create place");
  return result;
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
