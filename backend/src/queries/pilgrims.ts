/**
 * Pilgrim Queries
 * Read operations for pilgrims
 */

import { db } from "../lib/db.js";
import { pilgrims, bookings } from "@albergue/domain-model";
import {
  eq,
  and,
  like,
  or,
  isNull,
  isNotNull,
  count,
  desc,
  asc,
  gt,
  gte,
  lte,
} from "drizzle-orm";
import type { Pilgrim, Booking } from "../types/index.js";
import type {
  PaginatedResponse,
  PaginationParams,
  PilgrimFilter,
} from "../types/index.js";

/**
 * Get all pilgrims with pagination
 */
export async function getAllPilgrims(
  params: PaginationParams & PilgrimFilter = {},
): Promise<PaginatedResponse<Pilgrim>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = "createdAt",
    orderDirection = "desc",
    language,
    nationality,
    checkInDateFrom,
    checkInDateTo,
  } = params;

  const offset = (page - 1) * pageSize;
  const orderFn = orderDirection === "asc" ? asc : desc;

  // Build where conditions
  const whereConditions = [];

  if (language) {
    whereConditions.push(eq(pilgrims.language, language));
  }

  if (nationality) {
    whereConditions.push(eq(pilgrims.nationality, nationality));
  }

  // Join with bookings for date filtering
  let query = db
    .select({
      pilgrim: pilgrims,
      hasActiveBooking: gt(count(bookings.id), 0),
    })
    .from(pilgrims)
    .leftJoin(bookings, eq(bookings.pilgrimId, pilgrims.id))
    .groupBy(pilgrims.id)
    .$dynamic();

  if (checkInDateFrom || checkInDateTo) {
    const dateConditions = [];
    if (checkInDateFrom) {
      dateConditions.push(
        and(
          isNotNull(bookings.checkInDate),
          gte(bookings.checkInDate, checkInDateFrom),
        ),
      );
    }
    if (checkInDateTo) {
      dateConditions.push(
        and(
          isNotNull(bookings.checkInDate),
          lte(bookings.checkInDate, checkInDateTo),
        ),
      );
    }
    whereConditions.push(or(...dateConditions));
  }

  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions));
  }

  // Get total count
  const [countResult] = await db
    .select({ count: count() })
    .from(pilgrims)
    .leftJoin(bookings, eq(bookings.pilgrimId, pilgrims.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .groupBy(pilgrims.id);

  const total = countResult?.count || 0;

  // Get paginated results
  const results = await query
    .orderBy(
      orderFn(
        orderBy in pilgrims ? (pilgrims as any)[orderBy] : pilgrims.createdAt,
      ),
    )
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: results.map((r) => r.pilgrim),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get pilgrim by ID
 */
export async function getPilgrimById(id: number): Promise<Pilgrim | null> {
  const [result] = await db
    .select()
    .from(pilgrims)
    .where(eq(pilgrims.id, id))
    .limit(1);

  return result || null;
}

/**
 * Get pilgrim by email
 */
export async function getPilgrimByEmail(
  email: string,
): Promise<Pilgrim | null> {
  const [result] = await db
    .select()
    .from(pilgrims)
    .where(eq(pilgrims.email, email))
    .limit(1);

  return result || null;
}

/**
 * Get pilgrim by document number
 */
export async function getPilgrimByDocumentNumber(
  documentType: string,
  documentNumber: string,
): Promise<Pilgrim | null> {
  const [result] = await db
    .select()
    .from(pilgrims)
    .where(
      and(
        eq(pilgrims.documentType, documentType),
        eq(pilgrims.documentNumber, documentNumber),
      ),
    )
    .limit(1);

  return result || null;
}

/**
 * Search pilgrims by name
 */
export async function searchPilgrims(
  query: string,
  limit: number = 10,
): Promise<Pilgrim[]> {
  const results = await db
    .select()
    .from(pilgrims)
    .where(
      or(
        like(pilgrims.firstName, `%${query}%`),
        like(pilgrims.lastName1, `%${query}%`),
        like(pilgrims.lastName2, `%${query}%`),
      ),
    )
    .orderBy(asc(pilgrims.lastName1))
    .limit(limit);

  return results;
}

/**
 * Get pilgrims with active bookings
 */
export async function getPilgrimsWithActiveBookings(): Promise<Pilgrim[]> {
  const results = await db
    .select({ pilgrim: pilgrims })
    .from(pilgrims)
    .innerJoin(bookings, eq(bookings.pilgrimId, pilgrims.id))
    .where(
      and(
        eq(bookings.status, "reserved"),
        or(
          isNull(bookings.reservationExpiresAt),
          gt(bookings.reservationExpiresAt, new Date()),
        ),
      ),
    )
    .groupBy(pilgrims.id);

  return results.map((r) => r.pilgrim);
}

/**
 * Get pilgrim statistics
 */
export async function getPilgrimStats() {
  const [total] = await db.select({ count: count() }).from(pilgrims);

  const nationalityStats = await db
    .select({
      nationality: pilgrims.nationality,
      count: count(),
    })
    .from(pilgrims)
    .where(isNotNull(pilgrims.nationality))
    .groupBy(pilgrims.nationality)
    .orderBy(desc(count()));

  const languageStats = await db
    .select({
      language: pilgrims.language,
      count: count(),
    })
    .from(pilgrims)
    .groupBy(pilgrims.language)
    .orderBy(desc(count()));

  const genderStats = await db
    .select({
      gender: pilgrims.gender,
      count: count(),
    })
    .from(pilgrims)
    .groupBy(pilgrims.gender);

  return {
    totalPilgrims: total?.count || 0,
    byNationality: Object.fromEntries(
      nationalityStats.map((s) => [s.nationality, s.count]),
    ),
    byLanguage: Object.fromEntries(
      languageStats.map((s) => [s.language, s.count]),
    ),
    byGender: Object.fromEntries(genderStats.map((s) => [s.gender, s.count])),
  };
}

/**
 * Get recent pilgrims
 */
export async function getRecentPilgrims(limit: number = 5): Promise<Pilgrim[]> {
  const results = await db
    .select()
    .from(pilgrims)
    .orderBy(desc(pilgrims.createdAt))
    .limit(limit);

  return results;
}
