/**
 * User Commands
 * Write operations for users
 */

import { db } from '../lib/db.js';
import { users } from '@albergue/domain-model';
import { eq, inArray } from 'drizzle-orm';
import type { InsertUser, User } from '../types/index.js';

/**
 * Create a new user
 */
export async function createUser(input: InsertUser): Promise<User> {
  void input;
  throw new Error('User creation is disabled until secure password hashing is implemented');
}

/**
 * Create multiple users (batch)
 */
export async function createUsersBatch(inputs: InsertUser[]): Promise<User[]> {
  void inputs;
  throw new Error('User creation is disabled until secure password hashing is implemented');
}

/**
 * Update a user's password
 */
export async function updateUserPassword(
  id: number,
  password: string
): Promise<boolean> {
  void id;
  void password;
  throw new Error('Password updates are disabled until secure password hashing is implemented');
}

/**
 * Update a user's username
 */
export async function updateUserUsername(
  id: number,
  username: string
): Promise<boolean> {
  const [result] = await db
    .update(users)
    .set({
      username,
    })
    .where(eq(users.id, id))
    .returning();
  
  return !!result;
}

/**
 * Delete a user (hard delete)
 * WARNING: Only use when absolutely necessary
 */
export async function deleteUser(id: number): Promise<boolean> {
  const [result] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();
  
  return !!result;
}

/**
 * Bulk delete users
 * WARNING: Only use when absolutely necessary
 */
export async function bulkDeleteUsers(ids: number[]): Promise<number> {
  if (ids.length === 0) return 0;
  const results = await db
    .delete(users)
    .where(inArray(users.id, ids))
    .returning();
  
  return results.length;
}
