/**
 * Camino progress routes — anonymous session-scoped km diary + Vía de la Plata stages.
 * GET endpoints are public. POST /log-km upserts today's distance for the session.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { and, asc, eq, sql } from "drizzle-orm";
import { caminoKmLogs } from "@albergue/domain-model";
import { db } from "../lib/db.js";
import type { ApiResponse } from "../types/index.js";

const camino = new Hono();

const DAILY_GOAL_KM = 25;
const TOTAL_ROUTE_KM = 847;

/** Sevilla→Santiago-ish stage list used by the dashboard (km cumulative). */
const STAGES = [
  { id: "1", name: "Sevilla → Guillena", distance: 22.2, difficulty: "easy" as const, estimatedDays: 1 },
  { id: "2", name: "Guillena → Castilblanco", distance: 18.5, difficulty: "easy" as const, estimatedDays: 1 },
  { id: "3", name: "Castilblanco → Almadén", distance: 25.8, difficulty: "medium" as const, estimatedDays: 1 },
  { id: "4", name: "Almadén → Real de la Jara", distance: 19.3, difficulty: "easy" as const, estimatedDays: 1 },
  { id: "5", name: "Real de la Jara → Monesterio", distance: 21.7, difficulty: "medium" as const, estimatedDays: 1 },
  { id: "6", name: "Monesterio → Fuente de Cantos", distance: 19.4, difficulty: "easy" as const, estimatedDays: 1 },
  { id: "7", name: "Fuente de Cantos → Zafra", distance: 20.1, difficulty: "easy" as const, estimatedDays: 1 },
  { id: "8", name: "Zafra → Villafranca", distance: 19.8, difficulty: "medium" as const, estimatedDays: 1 },
  { id: "9", name: "Villafranca → Alcuéscar", distance: 38.2, difficulty: "hard" as const, estimatedDays: 2 },
  { id: "10", name: "Alcuéscar → Cáceres", distance: 23.1, difficulty: "medium" as const, estimatedDays: 1 },
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekStartIso(): string {
  const d = new Date();
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

function requireSessionId(c: Context): string {
  const header = c.req.header("x-camino-session")?.trim();
  if (header && /^[a-zA-Z0-9_-]{8,128}$/.test(header)) return header;
  throw new HTTPException(400, { message: "Missing or invalid X-Camino-Session" });
}

function num(value: string | null | undefined): number {
  return value ? Number(value) : 0;
}

function stageProgress(totalKm: number) {
  let walked = 0;
  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];
    const nextStart = walked + stage.distance;
    if (totalKm < nextStart || i === STAGES.length - 1) {
      const completed = Math.min(Math.max(totalKm - walked, 0), stage.distance);
      const remaining = Math.max(stage.distance - completed, 0);
      const pct = Math.round((completed / stage.distance) * 100);
      const next = STAGES[i + 1];
      return {
        stageName: stage.name,
        progressPercent: pct,
        distanceCompleted: Math.round(completed * 10) / 10,
        distanceRemaining: Math.round(remaining * 10) / 10,
        distanceToNext: next ? next.distance : 0,
        nextStage: next ? next.name : "Fin de tramo local",
        startTime: stage.name.split(" → ")[0],
        estimatedArrival: stage.name.split(" → ")[1] ?? stage.name,
        pace: "4.5 km/h",
      };
    }
    walked = nextStart;
  }
  return {
    stageName: STAGES[0].name,
    progressPercent: 0,
    distanceCompleted: 0,
    distanceRemaining: STAGES[0].distance,
    distanceToNext: STAGES[1]?.distance ?? 0,
    nextStage: STAGES[1]?.name ?? "",
    startTime: "Sevilla",
    estimatedArrival: "Guillena",
    pace: "4.5 km/h",
  };
}

function computeStreaks(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(dates)].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00Z").getTime();
    const cur = new Date(sorted[i] + "T00:00:00Z").getTime();
    if (cur - prev === 86400000) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  // Current streak from today/yesterday backwards
  const today = todayIso();
  const set = new Set(sorted);
  let current = 0;
  let cursor = new Date(today + "T00:00:00Z");
  if (!set.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (set.has(cursor.toISOString().slice(0, 10))) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return { current, longest: Math.max(longest, current) };
}

camino.get("/stages", async (c: Context) => {
  const sessionId = c.req.header("x-camino-session")?.trim();
  let totalKm = 0;
  if (sessionId) {
    const rows = await db
      .select({ km: sql<string>`coalesce(sum(${caminoKmLogs.km}), 0)` })
      .from(caminoKmLogs)
      .where(eq(caminoKmLogs.sessionId, sessionId));
    totalKm = num(rows[0]?.km);
  }
  let walked = 0;
  const data = STAGES.map((stage) => {
    const completed = totalKm >= walked + stage.distance;
    walked += stage.distance;
    return { ...stage, completed };
  });
  return c.json<ApiResponse<typeof data>>({
    success: true,
    data,
    message: "Stages retrieved",
    timestamp: new Date().toISOString(),
  });
});

camino.get("/stage", async (c: Context) => {
  const sessionId = c.req.header("x-camino-session")?.trim();
  let totalKm = 0;
  if (sessionId) {
    const rows = await db
      .select({ km: sql<string>`coalesce(sum(${caminoKmLogs.km}), 0)` })
      .from(caminoKmLogs)
      .where(eq(caminoKmLogs.sessionId, sessionId));
    totalKm = num(rows[0]?.km);
  }
  const data = stageProgress(totalKm);
  return c.json({
    success: true,
    ...data,
    timestamp: new Date().toISOString(),
  });
});

camino.get("/metrics", async (c: Context) => {
  try {
    const sessionId = requireSessionId(c);
    const today = todayIso();
    const weekStart = weekStartIso();

    const logs = await db
      .select()
      .from(caminoKmLogs)
      .where(eq(caminoKmLogs.sessionId, sessionId))
      .orderBy(asc(caminoKmLogs.logDate));

    const mapped = logs.map((row) => ({
      km: num(row.km),
      date: String(row.logDate),
    }));

    const dailyKm = mapped.find((l) => l.date === today)?.km ?? 0;
    const weeklyLogs = mapped.filter((l) => l.date >= weekStart);
    const weeklyTotal = weeklyLogs.reduce((s, l) => s + l.km, 0);
    const historicalTotal = mapped.reduce((s, l) => s + l.km, 0);
    const best = mapped.reduce(
      (acc, l) => (l.km > acc.km ? l : acc),
      { km: 0, date: today },
    );
    const streaks = computeStreaks(mapped.map((l) => l.date));

    const data = {
      daily: {
        km: dailyKm,
        date: today,
        goal: DAILY_GOAL_KM,
        percentage: Math.round((dailyKm / DAILY_GOAL_KM) * 1000) / 10,
      },
      weekly: {
        totalKm: Math.round(weeklyTotal * 10) / 10,
        days: weeklyLogs.length,
        averageDaily:
          weeklyLogs.length > 0
            ? Math.round((weeklyTotal / weeklyLogs.length) * 10) / 10
            : 0,
        logs: weeklyLogs,
      },
      historical: {
        totalKm: Math.round(historicalTotal * 10) / 10,
        totalDays: mapped.length,
        averageDaily:
          mapped.length > 0
            ? Math.round((historicalTotal / mapped.length) * 10) / 10
            : 0,
        logs: mapped,
        bestDay: best,
        streaks,
        route: {
          totalKm: TOTAL_ROUTE_KM,
          completedKm: Math.round(historicalTotal * 10) / 10,
          percent: Math.round((historicalTotal / TOTAL_ROUTE_KM) * 1000) / 10,
        },
      },
    };

    return c.json<ApiResponse<typeof data>>({
      success: true,
      data,
      message: "Metrics retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get metrics: ${String(error)}`,
    });
  }
});

camino.post("/log-km", async (c: Context) => {
  try {
    const sessionId = requireSessionId(c);
    const body = await c.req.json<{ km?: number; date?: string }>();
    const km = Number(body.km);
    const date = body.date && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : todayIso();

    if (!Number.isFinite(km) || km < 0 || km > 80) {
      throw new HTTPException(400, { message: "km must be between 0 and 80" });
    }

    const existing = await db
      .select()
      .from(caminoKmLogs)
      .where(and(eq(caminoKmLogs.sessionId, sessionId), eq(caminoKmLogs.logDate, date)))
      .limit(1);

    if (existing[0]) {
      await db
        .update(caminoKmLogs)
        .set({ km: String(km), updatedAt: new Date() })
        .where(eq(caminoKmLogs.id, existing[0].id));
    } else {
      await db.insert(caminoKmLogs).values({
        sessionId,
        km: String(km),
        logDate: date,
      });
    }

    return c.json({
      success: true,
      data: { km, date },
      message: "Km logged",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to log km: ${String(error)}`,
    });
  }
});

export default camino;
