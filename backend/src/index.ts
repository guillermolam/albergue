/**
 * Local development / traditional-Node entry point.
 * Production runs on Cloudflare Workers via src/worker.ts — this file exists
 * only so `pnpm dev`/`pnpm start` can run the same app as a plain HTTP
 * server without needing Wrangler.
 */

import { serve } from "@hono/node-server";
import app from "./app.js";
import { startConnectionMonitor } from "./lib/db.js";

const port = Number(process.env.PORT || "3001");

console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║   Albergue Municipal Carrascalejo API Server                ║
  ║   Backend for Pilgrim Management System                     ║
  ╠════════════════════════════════════════════════════════════╣
  ║   Server running at: http://localhost:${port}                   ║
  ║   API Base URL: http://localhost:${port}/api                    ║
  ║   Health Check: http://localhost:${port}/health                 ║
  ╚════════════════════════════════════════════════════════════╝
`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server started on port ${port}`);
    startConnectionMonitor();
  },
);

export default app;
