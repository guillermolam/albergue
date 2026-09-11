import { db } from '../lib/db';
import { beds, bookings } from '../../schema';
import { eq, and, or, like, desc, asc, isNull, not, gte, lte, between } from 'drizzle-orm';
import { DatabaseError, NotFoundError, withDbRetry } from '../lib/errors';
import type { Bed } from '../../schema';
import type { PaginatedResult } from './pilgrims';

/**
 * Query options for beds
 */
export interface BedQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  roomNumber?: number;
  roomType?: string;
  isAvailable?: boolean;
  status?: string | string[];
  sortBy?: 'id' | 'bedNumber' | 'roomNumber' | 'pricePerNight';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query: Get a single bed by ID
 */
export async function getBedById(id: number): Promise<Bed | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(beds)
        .where(eq(beds.id, id))
        .limit(1);

      return result || null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get bed ${id}`,
        error as Error,
        'SELECT beds WHERE id = $1',
        { id },
      );
    }
  });
}

/**
 * Query: Get a bed by ID or throw
 */
export async function getBedByIdOrThrow(id: number): Promise<Bed> {
  const bed = await getBedById(id);
  if (!bed) {
    throw new NotFoundError('Bed', id);
  }
  return bed;
}

/**
 * Query: Get bed by room and bed number
 */
export async function getBedByRoomAndNumber(
  roomNumber: number,
  bedNumber: number,
): Promise<Bed | null> {
  return withDbRetry(async () => {
    try {
      const [result] = await db
        .select()
        .from(beds)
        .where(and(
          eq(beds.roomNumber, roomNumber),
          eq(beds.bedNumber, bedNumber),
        ))
        .limit(1);

      return result || null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get bed by room ${roomNumber} and number ${bedNumber}`,
        error as Error,
        'SELECT beds WHERE room_number = $1 AND bed_number = $2',
        { roomNumber, bedNumber },
      );
    }
  });
}

/**
 * Query: Get all beds with pagination and filtering
 */
export async function getBeds(options: BedQueryOptions = {}): Promise<PaginatedResult<Bed>> {
  return withDbRetry(async () => {
    try {
      const {
        page = 1,
        pageSize = 50,
        search,
        roomNumber,
        roomType,
        isAvailable,
        status,
        sortBy = 'roomNumber',
        sortOrder = 'asc',
      } = options;

      const offset = (page - 1) * pageSize;

      // Base where conditions
      const whereConditions = [];

      // Search filter (searches room name, room type, bed number)
      if (search) {
        const searchPattern = `%${search}%`;
        whereConditions.push(
          or(
            like(beds.roomName, searchPattern),
            like(beds.roomType, searchPattern),
            like(beds.bedNumber, searchPattern),
          ),
        );
      }

      // Additional filters
      if (roomNumber) {
        whereConditions.push(eq(beds.roomNumber, roomNumber));
      }
      if (roomType) {
        whereConditions.push(eq(beds.roomType, roomType));
      }
      if (isAvailable) {
        whereConditions.push(eq(beds.isAvailable, isAvailable));
      }
      if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        whereConditions.push(or(...statuses.map(s => eq(beds.status, s))));
      }

      // Build the where clause
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Sort order mapping
      const sortField = {
        id: beds.id,
        bedNumber: beds.bedNumber,
        roomNumber: beds.roomNumber,
        pricePerNight: beds.pricePerNight,
      }[sortBy] || beds.roomNumber;

      const orderBy = sortOrder === 'asc' ? asc(sortField) : desc(sortField);

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(whereClause);

      const total = Number(countResult?.count || 0);

      // Get paginated data
      const data = await db
        .select()
        .from(beds)
        .where(whereClause)
        .orderBy(orderBy, beds.bedNumber)
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
        'Failed to get beds',
        error as Error,
        'SELECT beds WITH filters',
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
 * Query: Get available beds for a date range
 */
export async function getAvailableBeds(
  checkInDate: Date,
  checkOutDate: Date,
  roomType?: string,
): Promise<Bed[]> {
  return withDbRetry(async () => {
    try {
      // First, get all beds that are marked as available
      const allBeds = await db
        .select()
        .from(beds)
        .where(and(
          eq(beds.isAvailable, true),
          roomType ? eq(beds.roomType, roomType) : undefined,
        ));

      const bedIds = allBeds.map(b => b.id);

      if (bedIds.length === 0) {
        return [];
      }

      // Find beds that have bookings during the requested dates
      const bookedBeds = await db
        .selectDistinct({ bedId: bookings.bedAssignmentId })
        .from(bookings)
        .where(
          and(
            or(...bedIds.map(id => eq(bookings.bedAssignmentId, id))),
            or(
              and(
                lte(bookings.checkInDate, checkInDate),
                gt(bookings.checkOutDate, checkInDate),
              ),
              and(
                lte(bookings.checkInDate, checkOutDate),
                gt(bookings.checkOutDate, checkOutDate),
              ),
              and(
                gte(bookings.checkInDate, checkInDate),
                lte(bookings.checkOutDate, checkOutDate),
              ),
            ),
            not(eq(bookings.status, 'cancelled')),
            not(eq(bookings.status, 'no_show')),
          ),
        );

      const bookedBedIds = bookedBeds.map(b => b.bedId).filter(Boolean);

      // Filter out booked beds
      const availableBeds = allBeds.filter(bed => !bookedBedIds.includes(bed.id));

      return availableBeds;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get available beds',
        error as Error,
        'SELECT beds NOT IN bookings WHERE dates overlap',
        { checkInDate, checkOutDate, roomType },
      );
    }
  });
}

/**
 * Query: Get bed occupancy by room
 */
export async function getBedOccupancyByRoom(): Promise<Array<{
  roomNumber: number;
  roomName: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
}>> {
  return withDbRetry(async () => {
    try {
      // Get all distinct rooms
      const rooms = await db
        .selectDistinct({
          roomNumber: beds.roomNumber,
          roomName: beds.roomName,
          roomType: beds.roomType,
        })
        .from(beds)
        .orderBy(beds.roomNumber);

      const result: Array<{
        roomNumber: number;
        roomName: string;
        roomType: string;
        totalBeds: number;
        availableBeds: number;
        occupiedBeds: number;
        reservedBeds: number;
        maintenanceBeds: number;
      }> = [];

      for (const room of rooms) {
        const roomBeds = await db
          .select()
          .from(beds)
          .where(eq(beds.roomNumber, room.roomNumber));

        const totalBeds = roomBeds.length;
        const availableBeds = roomBeds.filter(b => b.isAvailable).length;
        const occupiedBeds = roomBeds.filter(b => b.status === 'occupied').length;
        const reservedBeds = roomBeds.filter(b => b.status === 'reserved').length;
        const maintenanceBeds = roomBeds.filter(b => 
          b.status === 'maintenance' || b.status === 'needs_cleaning'
        ).length;

        result.push({
          roomNumber: room.roomNumber,
          roomName: room.roomName,
          roomType: room.roomType,
          totalBeds,
          availableBeds,
          occupiedBeds,
          reservedBeds,
          maintenanceBeds,
        });
      }

      return result;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get bed occupancy by room',
        error as Error,
        'SELECT beds GROUP BY room',
      );
    }
  });
}

/**
 * Query: Get beds that need cleaning
 */
export async function getBedsNeedingCleaning(): Promise<Bed[]> {
  return withDbRetry(async () => {
    try {
      const result = await db
        .select()
        .from(beds)
        .where(
          or(
            eq(beds.status, 'needs_cleaning'),
            eq(beds.status, 'occupied'),
          ),
        )
        .orderBy(beds.lastCleanedAt, beds.roomNumber, beds.bedNumber);

      return result;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get beds needing cleaning',
        error as Error,
        'SELECT beds WHERE status IN (needs_cleaning, occupied)',
      );
    }
  });
}

/**
 * Query: Get bed statistics
 */
export async function getBedStats(): Promise<{
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
  byRoomType: Record<string, {
    total: number;
    available: number;
    averagePrice: number;
  }>;
}> {
  return withDbRetry(async () => {
    try {
      // Total beds
      const [totalResult] = await db
        .select({ count: count() })
        .from(beds);
      const total = Number(totalResult?.count || 0);

      // Available beds
      const [availableResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(eq(beds.isAvailable, true));
      const available = Number(availableResult?.count || 0);

      // Occupied beds
      const [occupiedResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(eq(beds.status, 'occupied'));
      const occupied = Number(occupiedResult?.count || 0);

      // Reserved beds
      const [reservedResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(eq(beds.status, 'reserved'));
      const reserved = Number(reservedResult?.count || 0);

      // Maintenance beds
      const [maintenanceResult] = await db
        .select({ count: count() })
        .from(beds)
        .where(
          or(
            eq(beds.status, 'maintenance'),
            eq(beds.status, 'needs_cleaning'),
          ),
        );
      const maintenance = Number(maintenanceResult?.count || 0);

      // By room type
      const roomTypes = await db
        .selectDistinct({ roomType: beds.roomType })
        .from(beds)
        .orderBy(beds.roomType);

      const byRoomType: Record<string, {
        total: number;
        available: number;
        averagePrice: number;
      }> = {};

      for (const { roomType } of roomTypes) {
        const typeBeds = await db
          .select()
          .from(beds)
          .where(eq(beds.roomType, roomType || ''));

        const totalBeds = typeBeds.length;
        const availableBeds = typeBeds.filter(b => b.isAvailable).length;
        const averagePrice = typeBeds.reduce(
          (sum, bed) => sum + parseFloat(bed.pricePerNight), 0
        ) / Math.max(totalBeds, 1);

        byRoomType[roomType || 'Unknown'] = {
          total: totalBeds,
          available: availableBeds,
          averagePrice: Math.round(averagePrice * 100) / 100,
        };
      }

      return {
        total,
        available,
        occupied,
        reserved,
        maintenance,
        byRoomType,
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get bed statistics',
        error as Error,
        'SELECT beds STATS',
      );
    }
  });
}

/**
 * Query: Get room types with their details
 */
export async function getRoomTypes(): Promise<Array<{
  type: string;
  count: number;
  available: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}>> {
  return withDbRetry(async () => {
    try {
      const roomTypes = await db
        .selectDistinct({ roomType: beds.roomType })
        .from(beds)
        .orderBy(beds.roomType);

      const result: Array<{
        type: string;
        count: number;
        available: number;
        minPrice: number;
        maxPrice: number;
        avgPrice: number;
      }> = [];

      for (const { roomType } of roomTypes) {
        const typeBeds = await db
          .select()
          .from(beds)
          .where(eq(beds.roomType, roomType || ''));

        const prices = typeBeds.map(b => parseFloat(b.pricePerNight));
        const available = typeBeds.filter(b => b.isAvailable).length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / Math.max(prices.length, 1);

        result.push({
          type: roomType || 'Unknown',
          count: typeBeds.length,
          available,
          minPrice: Math.round(minPrice * 100) / 100,
          maxPrice: Math.round(maxPrice * 100) / 100,
          avgPrice: Math.round(avgPrice * 100) / 100,
        });
      }

      return result;
    } catch (error) {
      throw new DatabaseError(
        'Failed to get room types',
        error as Error,
        'SELECT beds GROUP BY room_type',
      );
    }
  });
}
