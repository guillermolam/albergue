/**
 * User Commands
 * Write operations for users
 */

import { db } from '../lib/db.js';
import { users } from '@albergue/domain-model';
import { eq, inArray } from 'drizzle-orm';
import { hashPassword } from '../lib/passwords.js';
import type { InsertUser, User } from '../types/index.js';

/**
 * Create a new user (password hashed with scrypt — AUTH-001)
 */
export async function createUser(input: InsertUser): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({
      username: input.username,
      password: await hashPassword(input.password),
      createdAt: new Date(),
    })
    .returning();

  if (!result) throw new Error('Failed to create user');
  return result;
}

/**
 * Create multiple users (batch)
 */
export async function createUsersBatch(inputs: InsertUser[]): Promise<User[]> {
  if (inputs.length === 0) return [];
  const values = await Promise.all(
    inputs.map(async (input) => ({
      username: input.username,
      password: await hashPassword(input.password),
      createdAt: new Date(),
    }))
  );
  return db.insert(users).values(values).returning();
}

/**
 * Update a user's password
 */
export async function updateUserPassword(
  id: number,
  password: string
): Promise<boolean> {
  const [result] = await db
    .update(users)
    .set({ password: await hashPassword(password) })
    .where(eq(users.id, id))
    .returning();

  return !!result;
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
