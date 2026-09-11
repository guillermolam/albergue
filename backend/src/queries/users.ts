/**
 * User Queries
 * Read operations for users
 */

import { db } from '../lib/db';
import { users } from '@albergue/domain-model';
import { eq, like, count, desc, asc } from 'drizzle-orm';
import type { User } from '../types';
import type { PaginatedResponse, PaginationParams } from '../types';

/**
 * Get all users with pagination
 */
export async function getAllUsers(
  params: PaginationParams = {}
): Promise<PaginatedResponse<User>> {
  const {
    page = 1,
    pageSize = 20,
    orderBy = 'username',
    orderDirection = 'asc',
  } = params;

  const offset = (page - 1) * pageSize;
  const sortOrder = orderDirection === 'asc' ? asc(users.username) : desc(users.username);

  // Get total count
  const [countResult] = await db
    .select({ count: count() })
    .from(users);

  const total = Number(countResult?.count || 0);

  // Get paginated results
  const results = await db
    .select()
    .from(users)
    .orderBy(sortOrder)
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: results,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  
  return result || null;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  
  return result || null;
}

/**
 * Search users
 */
export async function searchUsers(query: string, limit: number = 10): Promise<User[]> {
  const results = await db
    .select()
    .from(users)
    .where(
      like(users.username, `%${query}%`)
    )
    .orderBy(asc(users.username))
    .limit(limit);
  
  return results;
}

/**
 * Get user count
 */
export async function getUserCount(): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(users);
  
  return Number(result?.count || 0);
}

/**
 * Get recent users
 */
export async function getRecentUsers(limit: number = 5): Promise<User[]> {
  const results = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
  
  return results;
}

/**
 * Check if username exists
 */
export async function usernameExists(username: string): Promise<boolean> {
  const [result] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.username, username));
  
  return Number(result?.count || 0) > 0;
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  const [total] = await db
    .select({ count: count() })
    .from(users);

  return {
    totalUsers: Number(total?.count || 0),
  };
}
