/**
 * Place Queries
 * Read operations for places and their child records (addresses, phones,
 * images, labels, prices). Children are fetched with a follow-up
 * WHERE placeId IN (...) query and grouped in JS, matching this codebase's
 * explicit query-builder style rather than Drizzle's relational `db.query`
 * API.
 */

import { db } from "../lib/db.js";
import {
  places,
  placeAddresses,
  placePhones,
  placeImages,
  placeLabels,
  placePrices,
} from "@albergue/domain-model";
import { eq, inArray, asc, and } from "drizzle-orm";
import type { Place, PlaceWithDetails, PlaceFilter } from "../types/index.js";

async function attachDetails(rows: Place[]): Promise<PlaceWithDetails[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((p) => p.id);

  const [addresses, phones, images, labels, prices] = await Promise.all([
    db.select().from(placeAddresses).where(inArray(placeAddresses.placeId, ids)),
    db.select().from(placePhones).where(inArray(placePhones.placeId, ids)),
    db.select().from(placeImages).where(inArray(placeImages.placeId, ids)),
    db.select().from(placeLabels).where(inArray(placeLabels.placeId, ids)),
    db.select().from(placePrices).where(inArray(placePrices.placeId, ids)),
  ]);

  return rows.map((place) => ({
    ...place,
    addresses: addresses.filter((a) => a.placeId === place.id),
    phones: phones.filter((p) => p.placeId === place.id),
    images: images.filter((i) => i.placeId === place.id),
    labels: labels.filter((l) => l.placeId === place.id),
    prices: prices.filter((p) => p.placeId === place.id),
  }));
}

/**
 * Get all places, optionally filtered by category. Public callers only ever
 * see active places (isActive defaults to true when not explicitly asked).
 */
export async function getAllPlaces(filter: PlaceFilter = {}): Promise<PlaceWithDetails[]> {
  const conditions = [];
  if (filter.category) {
    conditions.push(eq(places.category, filter.category as (typeof places.category.enumValues)[number]));
  }
  if (filter.isActive !== false) {
    conditions.push(eq(places.isActive, true));
  }

  const rows = await db
    .select()
    .from(places)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(places.displayOrder), asc(places.nameEs));

  return attachDetails(rows);
}

/**
 * Get a single place by slug, with all its details.
 */
export async function getPlaceBySlug(slug: string): Promise<PlaceWithDetails | null> {
  const [place] = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  if (!place) return null;

  const [withDetails] = await attachDetails([place]);
  return withDetails ?? null;
}
