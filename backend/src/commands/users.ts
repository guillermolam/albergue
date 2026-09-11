/**
 * User Commands
 * Write operations for users
 */

import { db } from '../lib/db';
import { users } from '../../domain_model/schema';
import { eq, and } from 'drizzle-orm';
import type { InsertUser, User } from '../types';

/**
 * Create a new user
 */
export async function createUser(input: InsertUser): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({
      ...input,
      createdAt: new Date(),
    })
    .returning();
  
  if (!result) {
    throw new Error('Failed to create user');
  }
  
  return result;
}

/**
 * Create multiple users (batch)
 */
export async function createUsersBatch(inputs: InsertUser[]): Promise<User[]> {
  const results = await db
    .insert(users)
    .values(
      inputs.map(input => ({
        ...input,
        createdAt: new Date(),
      }))
    )
    .returning();
  
  return results;
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
    .set({
      password,
    })
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
  const results = await db
    .delete(users)
    .where(and(...ids.map(id => eq(users.id, id))))
    .returning();
  
  return results.length;
}
