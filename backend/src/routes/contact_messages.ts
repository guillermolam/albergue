/**
 * Contact Message Routes
 *
 * POST / is the public website contact form submission (AUTH-005 style CSRF
 * origin check already applies at the Astro middleware layer in front of
 * this API). GET / and GET /:id are admin-only, for the admin UI to review
 * submissions — gated per-route (not via a blanket app.ts prefix) since this
 * router, unlike most others, mixes a public write with admin-only reads.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { authMiddleware } from "../lib/middleware.js";
import { getAllContactMessages, getContactMessageById } from "../queries/contact_messages.js";
import { createContactMessage } from "../commands/contact_messages.js";
import type { ApiResponse, PaginatedResponse, ContactMessage, InsertContactMessage } from "../types/index.js";

const contactMessages = new Hono();

/**
 * Best-effort admin notification email via Resend. No provider is
 * configured anywhere in this codebase today, so this degrades to a no-op
 * when RESEND_API_KEY is unset -- the message still persists and is visible
 * in the admin UI either way. Failures here never fail the submission.
 */
async function notifyAdminByEmail(submission: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_NOTIFY_FROM || "onboarding@resend.dev",
        to,
        reply_to: submission.email,
        subject: `Contact form: ${submission.subject || "New message"}`,
        text: `From: ${submission.name} <${submission.email}>\n\n${submission.message}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }
}

/**
 * POST / - Submit a contact message (public)
 */
contactMessages.post("/", async (c: Context) => {
  const body = await c.req.json<InsertContactMessage>().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    throw new HTTPException(400, { message: "Missing name, email, or message" });
  }

  const result = await createContactMessage(body);
  await notifyAdminByEmail(result);

  return c.json<ApiResponse<ContactMessage>>(
    {
      success: true,
      data: result,
      message: "Contact message received",
      timestamp: new Date().toISOString(),
    },
    201,
  );
});

/**
 * GET / - List contact messages, paginated (admin)
 */
contactMessages.get("/", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  const { page, pageSize } = c.req.query();
  const result = await getAllContactMessages({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });

  return c.json<ApiResponse<PaginatedResponse<ContactMessage>>>({
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /:id - Get a single contact message (admin)
 */
contactMessages.get("/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  const id = Number(c.req.param("id"));
  const result = await getContactMessageById(id);
  if (!result) {
    throw new HTTPException(404, { message: "Contact message not found" });
  }

  return c.json<ApiResponse<ContactMessage>>({
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  });
});

export default contactMessages;
