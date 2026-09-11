import { db } from '../lib/db';
import { pilgrims, bookings } from '../../schema';
import { eq, and, or, like, desc, asc, isNull, not, between } from 'drizzle-orm';
import { DatabaseError, NotFoundError, withDbRetry } from '../lib/errors';
import type { Pilgrim } from '../../schema';

/**
 * Query options for paginating and filtering pilgrims
 */
export interface PilgrimQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  nationality?: string;
  gender?: string;
  documentType?: string;
  language?: string;
  sortBy?: 'id' | 'firstName' | 'lastName1' | 'createdAt' | 'lastAccessDate';
  sortOrder?: 'asc' | 'desc';
  includeInactive?: boolean;
}

/**
 * Result type for paginated queries
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Query: Get a single pilgrim by ID
 */
export async function getPilgrimById(id: number): Promise<Pilgrim | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.id, id))
        .limit(1);

      if (!result) {
        return null;
      }

      return result;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get pilgrim ${id}`,
        error as Error,
        'SELECT pilgrims WHERE id = $1',
        { id },
      );
    }
  });
}

/**
 * Query: Get a pilgrim by ID or throw
 */
export async function getPilgrimByIdOrThrow(id: number): Promise<Pilgrim> {
  const pilgrim = await getPilgrimById(id);
  if (!pilgrim) {
    throw new NotFoundError('Pilgrim', id);
  }
  return pilgrim;
}

/**
 * Query: Get pilgrim by document number
 */
export async function getPilgrimByDocumentNumber(documentNumber: string): Promise<Pilgrim | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.documentNumber, documentNumber))
        .limit(1);

      return result || null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get pilgrim by document number ${documentNumber}`,
        error as Error,
        'SELECT pilgrims WHERE document_number = $1',
        { documentNumber },
      );
    }
  });
}

/**
 * Query: Get all pilgrims with pagination and filtering
 */
export async function getPilgrims(options: PilgrimQueryOptions = {}): Promise<PaginatedResult<Pilgrim>> {
  return withDbRetry(async () => {
    try {
      const {
        page = 1,
        pageSize = 20,
        search,
        nationality,
        gender,
        documentType,
        language,
        sortBy = 'id',
        sortOrder = 'desc',
        includeInactive = false,
      } = options;

      const offset = (page - 1) * pageSize;

      // Base where conditions
      const whereConditions = [];

      // Search filter (searches name, document number, email, phone)
      if (search) {
        const searchPattern = `%${search}%`;
        whereConditions.push(
          or(
            like(pilgrims.firstName, searchPattern),
            like(pilgrims.lastName1, searchPattern),
            like(pilgrims.lastName2, searchPattern),
            like(pilgrims.documentNumber, searchPattern),
            like(pilgrims.email, searchPattern),
            like(pilgrims.phone, searchPattern),
          ),
        );
      }

      // Additional filters
      if (nationality) {
        whereConditions.push(eq(pilgrims.nationality, nationality));
      }
      if (gender) {
        whereConditions.push(eq(pilgrims.gender, gender));
      }
      if (documentType) {
        whereConditions.push(eq(pilgrims.documentType, documentType));
      }
      if (language) {
        whereConditions.push(eq(pilgrims.language, language));
      }

      // Active filter
      if (!includeInactive) {
        whereConditions.push(eq(pilgrims.consentGiven, true));
      }

      // Build the where clause
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Sort order mapping
      const sortField = {
        id: pilgrims.id,
        firstName: pilgrims.firstName,
        lastName1: pilgrims.lastName1,
        createdAt: pilgrims.createdAt,
        lastAccessDate: pilgrims.lastAccessDate,
      }[sortBy] || pilgrims.id;

      const orderBy = sortOrder === 'asc' ? asc(sortField) : desc(sortField);

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(pilgrims)
        .where(whereClause);

      const total = Number(countResult?.count || 0);

      // Get paginated data
      const data = await db
        .select()
        .from(pilgrims)
        .where(whereClause)
        .orderBy(orderBy)
        .offset(offset)
        .limit(pageSize);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get pilgrims',
        error as Error,
        'SELECT pilgrims WITH filters',
        options,
      );
    }
  });
}

// Helper for count
function count() {
  return 'count' as any;
}

/**
 * Query: Get pilgrims by check-in date range (for arrivals)
 */
export async function getPilgrimsByArrivalDate(
  startDate: Date,
  endDate: Date,
): Promise<Pilgrim[]> {
  return withDbRetry(async () => {
    try {
      const result = await db
        .selectDistinct({
          pilgrim: pilgrims,
        })
        .from(pilgrims)
        .innerJoin(bookings, eq(bookings.pilgrimId, pilgrims.id))
        .where(
          and(
            eq(pilgrims.consentGiven, true),
            between(bookings.checkInDate, startDate, endDate),
          ),
        )
        .orderBy(pilgrims.lastName1, pilgrims.firstName);

      return result.map(r => r.pilgrim);
    } catch (error) {
      throw new DatabaseError(
        `Failed to get pilgrims by arrival date range`,
        error as Error,
        'SELECT pilgrims JOIN bookings WHERE check_in_date BETWEEN',
        { startDate, endDate },
      );
    }
  });
}

/**
 * Query: Get pilgrims with expired consent
 */
export async function getPilgrimsWithExpiredConsent(): Promise<Pilgrim[]> {
  return withDbRetry(async () => {
    try {
      const now = new Date();
      const result = await db
        .select()
        .from(pilgrims)
        .where(
          and(
            eq(pilgrims.consentGiven, true),
            not(isNull(pilgrims.dataRetentionUntil)),
            pilgrims.dataRetentionUntil.lte(now),
          ),
        )
        .orderBy(pilgrims.dataRetentionUntil);

      return result;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get pilgrims with expired consent',
        error as Error,
        'SELECT pilgrims WHERE data_retention_until < NOW()',
      );
    }
  });
}

/**
 * Query: Get pilgrim statistics
 */
export async function getPilgrimStats(): Promise<{
  total: number;
  active: number;
  byNationality: Record<string, number>;
  byGender: Record<string, number>;
  byLanguage: Record<string, number>;
  recent: Pilgrim[];
}> {
  return withDbRetry(async () => {
    try {
      // Total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(pilgrims);
      const total = Number(totalResult?.count || 0);

      // Active count
      const [activeResult] = await db
        .select({ count: count() })
        .from(pilgrims)
        .where(eq(pilgrims.consentGiven, true));
      const active = Number(activeResult?.count || 0);

      // By nationality
      const nationalityResult = await db
        .select({
          nationality: pilgrims.nationality,
          count: count(),
        })
        .from(pilgrims)
        .where(and(eq(pilgrims.consentGiven, true), not(isNull(pilgrims.nationality))))
        .groupBy(pilgrims.nationality)
        .orderBy(desc(count()));

      const byNationality: Record<string, number> = {};
      for (const row of nationalityResult) {
        byNationality[row.nationality || 'Unknown'] = Number(row.count);
      }

      // By gender
      const genderResult = await db
        .select({
          gender: pilgrims.gender,
          count: count(),
        })
        .from(pilgrims)
        .where(eq(pilgrims.consentGiven, true))
        .groupBy(pilgrims.gender);

      const byGender: Record<string, number> = {};
      for (const row of genderResult) {
        byGender[row.gender || 'Unknown'] = Number(row.count);
      }

      // By language
      const languageResult = await db
        .select({
          language: pilgrims.language,
          count: count(),
        })
        .from(pilgrims)
        .where(and(eq(pilgrims.consentGiven, true), not(isNull(pilgrims.language))))
        .groupBy(pilgrims.language)
        .orderBy(desc(count()));

      const byLanguage: Record<string, number> = {};
      for (const row of languageResult) {
        byLanguage[row.language || 'Unknown'] = Number(row.count);
      }

      // Recent pilgrims
      const recent = await db
        .select()
        .from(pilgrims)
        .where(eq(pilgrims.consentGiven, true))
        .orderBy(desc(pilgrims.createdAt))
        .limit(10);

      return {
        total,
        active,
        byNationality,
        byGender,
        byLanguage,
        recent,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get pilgrim statistics',
        error as Error,
        'SELECT pilgrims STATS',
      );
    }
  });
}
