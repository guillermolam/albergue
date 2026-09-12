/**
 * Auth Routes (AUTH-001/002)
 *
 * The backend is the authentication authority: it owns the users table and
 * verifies credentials. Sessions live in Astro (server-side driver); this
 * router is stateless — it only verifies and returns identity.
 *
 * All staff users are admins; pilgrims book anonymously and have no account.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { getUserByUsername } from "../queries/users.js";
import { verifyPasswordOrDummy } from "../lib/passwords.js";
import type { LoginRequest, LoginResponse } from "@albergue/api-contract";
import type { ApiResponse } from "../types/index.js";

const auth = new Hono();

/**
 * POST /auth/login - Verify credentials, return identity (public)
 */
auth.post("/login", async (c: Context) => {
  const body = await c.req.json<LoginRequest>().catch(() => null);
  if (!body?.username || !body?.password) {
    throw new HTTPException(400, { message: "Missing username or password" });
  }

  const user = await getUserByUsername(body.username);
  // Constant-cost path whether or not the username exists
  const ok = await verifyPasswordOrDummy(body.password, user?.password ?? null);
  if (!ok || !user) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  return c.json<ApiResponse<LoginResponse>>({
    success: true,
    data: { id: String(user.id), username: user.username, role: "admin" },
    timestamp: new Date().toISOString(),
  });
});

export default auth;
