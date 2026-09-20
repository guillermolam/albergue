/**
 * Contact Message Queries
 * Read operations for contact_messages
 */

import { db } from "../lib/db.js";
import { contactMessages } from "@albergue/domain-model";
import { eq, count, desc, asc } from "drizzle-orm";
import type { ContactMessage, PaginatedResponse, PaginationParams } from "../types/index.js";

/**
 * Get all contact messages with pagination, newest first by default
 */
export async function getAllContactMessages(
  params: PaginationParams = {},
): Promise<PaginatedResponse<ContactMessage>> {
  const { page = 1, pageSize = 20, orderDirection = "desc" } = params;

  const offset = (page - 1) * pageSize;
  const orderFn = orderDirection === "asc" ? asc : desc;

  const [countResult] = await db.select({ count: count() }).from(contactMessages);
  const total = countResult?.count || 0;

  // createdAt is the only sortable column contact_messages has today.
  const results = await db
    .select()
    .from(contactMessages)
    .orderBy(orderFn(contactMessages.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: results,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single contact message by ID
 */
export async function getContactMessageById(
  id: number,
): Promise<ContactMessage | null> {
  const [result] = await db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.id, id))
    .limit(1);

  return result || null;
}
