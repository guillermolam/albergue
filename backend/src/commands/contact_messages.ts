/**
 * Contact Message Commands
 * Write operations for contact_messages
 */

import { db } from "../lib/db.js";
import { contactMessages } from "@albergue/domain-model";
import type { InsertContactMessage, ContactMessage } from "../types/index.js";

/**
 * Create a new contact message (public submission from the website form)
 */
export async function createContactMessage(
  input: InsertContactMessage,
): Promise<ContactMessage> {
  const [result] = await db
    .insert(contactMessages)
    .values({
      ...input,
      status: "new",
      createdAt: new Date(),
    })
    .returning();

  if (!result) {
    throw new Error("Failed to create contact message");
  }

  return result;
}
