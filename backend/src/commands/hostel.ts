/**
 * Hostel Commands
 * Write operations for the hostel aggregate (admin only — enforced at the
 * route layer). Covers the singleton hostel record and its services list;
 * the rest of the structure (buildings/bedrooms/bunks/beds, social links,
 * certifications, compliance badges) is read-only via the API for now and
 * managed directly in the database / seed files until an admin UI exists.
 */

import { db } from "../lib/db.js";
import { hostels, hostelServices } from "@albergue/domain-model";
import { eq } from "drizzle-orm";
import type { InsertHostel, Hostel, InsertHostelService, HostelService } from "../types/index.js";

export async function updateHostel(
  id: number,
  input: Partial<InsertHostel>,
): Promise<Hostel | null> {
  const [result] = await db
    .update(hostels)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(hostels.id, id))
    .returning();

  return result ?? null;
}

export async function createHostelService(
  input: InsertHostelService,
): Promise<HostelService> {
  const [result] = await db.insert(hostelServices).values(input).returning();
  if (!result) throw new Error("Failed to create hostel service");
  return result;
}

export async function updateHostelService(
  id: number,
  input: Partial<InsertHostelService>,
): Promise<HostelService | null> {
  const [result] = await db
    .update(hostelServices)
    .set(input)
    .where(eq(hostelServices.id, id))
    .returning();

  return result ?? null;
}

export async function deleteHostelService(id: number): Promise<boolean> {
  const [result] = await db.delete(hostelServices).where(eq(hostelServices.id, id)).returning();
  return !!result;
}
