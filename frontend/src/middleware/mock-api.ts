import { defineMiddleware } from "astro:middleware";
import { PUBLIC_API_MODE } from "astro:env/client";

/**
 * Dev-only mock API (ASTRO-004). Active only when PUBLIC_API_MODE=mock;
 * in every other mode requests pass straight through.
 */
const MOCK_RESPONSES = {
  health: { ok: true, mode: "mock", ts: Date.now() },
  progress: { ok: true },
} as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "X-Mock-Mode": "true" },
  });
}

export const mockApiMiddleware = defineMiddleware(async (context, next) => {
  if (PUBLIC_API_MODE !== "mock") {
    return next();
  }

  const { pathname } = context.url;

  if (pathname === "/api/health" && context.request.method === "GET") {
    return json(MOCK_RESPONSES.health);
  }

  if (pathname === "/api/progress" && context.request.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await context.request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    if (!body.dailyGoalKm || !body.currentStageProgress || !body.ts) {
      return json({ error: "Missing required fields" }, 400);
    }

    const dailyGoalKm = Number(body.dailyGoalKm);
    const currentStageProgress = Number(body.currentStageProgress);

    if (dailyGoalKm < 15 || dailyGoalKm > 35) {
      return json({ error: "dailyGoalKm must be between 15 and 35" }, 400);
    }
    if (currentStageProgress < 0 || currentStageProgress > 100) {
      return json({ error: "currentStageProgress must be between 0 and 100" }, 400);
    }

    return json(MOCK_RESPONSES.progress);
  }

  return next();
});
