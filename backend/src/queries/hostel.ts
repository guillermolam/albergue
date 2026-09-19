/**
 * Hostel Queries
 * Read operations for the hostel aggregate (a singleton — the first row by
 * id) and its structure/content children. Same explicit query-builder +
 * group-in-JS style as places.ts.
 */

import { db } from "../lib/db.js";
import {
  hostels,
  hostelSocialLinks,
  hostelCertifications,
  hostelComplianceBadges,
  hostelServices,
  hostelOpeningHours,
  hostelBuildings,
  hostelBedrooms,
  hostelBedBunks,
  hostelBeds,
  beds,
} from "@albergue/domain-model";
import { asc, eq, inArray, and, isNotNull, min, count } from "drizzle-orm";
import type { Hostel, HostelAggregate, HostelStats } from "../types/index.js";

async function getHostelRow(): Promise<Hostel | null> {
  const [hostel] = await db.select().from(hostels).orderBy(asc(hostels.id)).limit(1);
  return hostel ?? null;
}

/**
 * Get the full hostel aggregate: info + social/certifications/compliance +
 * services + opening hours + the full buildings -> bedrooms -> bunks -> beds
 * structure, as one nested object.
 */
export async function getHostelAggregate(): Promise<HostelAggregate | null> {
  const hostel = await getHostelRow();
  if (!hostel) return null;

  const [socialLinks, certifications, complianceBadges, services, openingHours, buildings] =
    await Promise.all([
      db
        .select()
        .from(hostelSocialLinks)
        .where(eq(hostelSocialLinks.hostelId, hostel.id))
        .orderBy(asc(hostelSocialLinks.displayOrder)),
      db
        .select()
        .from(hostelCertifications)
        .where(eq(hostelCertifications.hostelId, hostel.id))
        .orderBy(asc(hostelCertifications.displayOrder)),
      db
        .select()
        .from(hostelComplianceBadges)
        .where(eq(hostelComplianceBadges.hostelId, hostel.id))
        .orderBy(asc(hostelComplianceBadges.displayOrder)),
      db
        .select()
        .from(hostelServices)
        .where(eq(hostelServices.hostelId, hostel.id))
        .orderBy(asc(hostelServices.displayOrder)),
      db
        .select()
        .from(hostelOpeningHours)
        .where(eq(hostelOpeningHours.hostelId, hostel.id))
        .orderBy(asc(hostelOpeningHours.dayOfWeek)),
      db
        .select()
        .from(hostelBuildings)
        .where(eq(hostelBuildings.hostelId, hostel.id))
        .orderBy(asc(hostelBuildings.displayOrder)),
    ]);

  const buildingIds = buildings.map((b) => b.id);
  const bedrooms = buildingIds.length
    ? await db
        .select()
        .from(hostelBedrooms)
        .where(inArray(hostelBedrooms.buildingId, buildingIds))
        .orderBy(asc(hostelBedrooms.displayOrder))
    : [];

  const bedroomIds = bedrooms.map((r) => r.id);
  const bedBunks = bedroomIds.length
    ? await db
        .select()
        .from(hostelBedBunks)
        .where(inArray(hostelBedBunks.bedroomId, bedroomIds))
        .orderBy(asc(hostelBedBunks.displayOrder))
    : [];

  const bunkIds = bedBunks.map((b) => b.id);
  const allBeds = bunkIds.length
    ? await db.select().from(hostelBeds).where(inArray(hostelBeds.bunkId, bunkIds))
    : [];

  const bedBunksWithBeds = bedBunks.map((bunk) => ({
    ...bunk,
    beds: allBeds.filter((b) => b.bunkId === bunk.id),
  }));
  const bedroomsWithBunks = bedrooms.map((room) => ({
    ...room,
    bedBunks: bedBunksWithBeds.filter((b) => b.bedroomId === room.id),
  }));
  const buildingsWithRooms = buildings.map((building) => ({
    ...building,
    bedrooms: bedroomsWithBunks.filter((r) => r.buildingId === building.id),
  }));

  return {
    ...hostel,
    socialLinks,
    certifications,
    complianceBadges,
    services,
    openingHours,
    buildings: buildingsWithRooms,
  };
}

/**
 * Derived stats for the homepage hero: bedroom count and total beds come
 * from the descriptive hostel structure; available-beds count and min
 * nightly price come from the operational `beds` table (joined via
 * hostel_beds.operationalBedId), so this reflects genuinely live inventory.
 */
export async function getHostelStats(): Promise<HostelStats> {
  const hostel = await getHostelRow();
  if (!hostel) {
    return { bedroomCount: 0, totalBeds: 0, availableBeds: 0, minPricePerNight: null };
  }

  const buildingRows = await db
    .select({ id: hostelBuildings.id })
    .from(hostelBuildings)
    .where(eq(hostelBuildings.hostelId, hostel.id));
  const buildingIds = buildingRows.map((b) => b.id);

  const bedroomRows = buildingIds.length
    ? await db
        .select({ id: hostelBedrooms.id })
        .from(hostelBedrooms)
        .where(inArray(hostelBedrooms.buildingId, buildingIds))
    : [];
  const bedroomIds = bedroomRows.map((r) => r.id);

  const bunkRows = bedroomIds.length
    ? await db
        .select({ id: hostelBedBunks.id })
        .from(hostelBedBunks)
        .where(inArray(hostelBedBunks.bedroomId, bedroomIds))
    : [];
  const bunkIds = bunkRows.map((b) => b.id);

  const [totalBedsResult] = bunkIds.length
    ? await db
        .select({ count: count() })
        .from(hostelBeds)
        .where(inArray(hostelBeds.bunkId, bunkIds))
    : [{ count: 0 }];

  const [availabilityResult] = bunkIds.length
    ? await db
        .select({ available: count(), minPrice: min(beds.pricePerNight) })
        .from(hostelBeds)
        .innerJoin(beds, eq(hostelBeds.operationalBedId, beds.id))
        .where(
          and(
            inArray(hostelBeds.bunkId, bunkIds),
            isNotNull(hostelBeds.operationalBedId),
            eq(beds.isAvailable, true),
          ),
        )
    : [{ available: 0, minPrice: null }];

  return {
    bedroomCount: bedroomIds.length,
    totalBeds: totalBedsResult?.count ?? 0,
    availableBeds: availabilityResult?.available ?? 0,
    minPricePerNight: availabilityResult?.minPrice ?? null,
  };
}
