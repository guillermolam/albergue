/**
 * Cloudflare Workers entry point. Free of any Node-server-specific imports
 * (@hono/node-server never loads here) — Hono apps implement the Workers
 * `fetch(request, env, ctx)` contract directly, so re-exporting the app is
 * the entire entry point.
 */
import app from "./app.js";

export default app;
