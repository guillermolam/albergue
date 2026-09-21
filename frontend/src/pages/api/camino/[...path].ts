/**
 * Same-origin /api/camino/* — runs on the frontend Worker.
 *
 * Does NOT call the backend Service Binding (hangs intermittently in prod).
 * Stores anonymous km logs in the SESSION KV namespace under `camino:{sid}`.
 * Backend /api/camino/* remains available for direct consumers / Neon sync later.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const COOKIE = 'camino_sid';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;
const DAILY_GOAL_KM = 25;
const TOTAL_ROUTE_KM = 847;

const STAGES = [
  { id: '1', name: 'Sevilla → Guillena', distance: 22.2, difficulty: 'easy', estimatedDays: 1 },
  {
    id: '2',
    name: 'Guillena → Castilblanco',
    distance: 18.5,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '3',
    name: 'Castilblanco → Almadén',
    distance: 25.8,
    difficulty: 'medium',
    estimatedDays: 1,
  },
  {
    id: '4',
    name: 'Almadén → Real de la Jara',
    distance: 19.3,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '5',
    name: 'Real de la Jara → Monesterio',
    distance: 21.7,
    difficulty: 'medium',
    estimatedDays: 1,
  },
  {
    id: '6',
    name: 'Monesterio → Fuente de Cantos',
    distance: 19.4,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '7',
    name: 'Fuente de Cantos → Zafra',
    distance: 20.1,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  { id: '8', name: 'Zafra → Villafranca', distance: 19.8, difficulty: 'medium', estimatedDays: 1 },
  {
    id: '9',
    name: 'Villafranca → Alcuéscar',
    distance: 38.2,
    difficulty: 'hard',
    estimatedDays: 2,
  },
  { id: '10', name: 'Alcuéscar → Cáceres', distance: 23.1, difficulty: 'medium', estimatedDays: 1 },
] as const;

type KmLog = { km: number; date: string };

function json(body: unknown, status = 200, setCookie?: string): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  if (setCookie) headers.set('Set-Cookie', setCookie);
  return new Response(JSON.stringify(body), { status, headers });
}

function newSessionId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

function readSession(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)camino_sid=([a-zA-Z0-9_-]{8,128})/);
  return match?.[1] ?? null;
}

function sessionCookie(id: string, secure: boolean): string {
  const flags = [
    `${COOKIE}=${id}`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE}`,
    'SameSite=Lax',
    'HttpOnly',
  ];
  if (secure) flags.push('Secure');
  return flags.join('; ');
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekStartIso(): string {
  const d = new Date();
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

function kvKey(sessionId: string): string {
  return `camino:${sessionId}`;
}

async function readLogs(sessionId: string): Promise<KmLog[]> {
  const raw = await env.SESSION.get(kvKey(sessionId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as KmLog[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLogs(sessionId: string, logs: KmLog[]): Promise<void> {
  await env.SESSION.put(kvKey(sessionId), JSON.stringify(logs));
}

function stageProgress(totalKm: number) {
  let walked = 0;
  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];
    const nextStart = walked + stage.distance;
    if (totalKm < nextStart || i === STAGES.length - 1) {
      const completed = Math.min(Math.max(totalKm - walked, 0), stage.distance);
      const remaining = Math.max(stage.distance - completed, 0);
      const next = STAGES[i + 1];
      return {
        success: true,
        stageName: stage.name,
        progressPercent: Math.round((completed / stage.distance) * 100),
        distanceCompleted: Math.round(completed * 10) / 10,
        distanceRemaining: Math.round(remaining * 10) / 10,
        distanceToNext: next ? next.distance : 0,
        nextStage: next ? next.name : 'Fin de tramo local',
        startTime: stage.name.split(' → ')[0],
        estimatedArrival: stage.name.split(' → ')[1] ?? stage.name,
        pace: '4.5 km/h',
        timestamp: new Date().toISOString(),
      };
    }
    walked = nextStart;
  }
  return {
    success: true,
    stageName: STAGES[0].name,
    progressPercent: 0,
    distanceCompleted: 0,
    distanceRemaining: STAGES[0].distance,
    distanceToNext: STAGES[1]?.distance ?? 0,
    nextStage: STAGES[1]?.name ?? '',
    startTime: 'Sevilla',
    estimatedArrival: 'Guillena',
    pace: '4.5 km/h',
    timestamp: new Date().toISOString(),
  };
}

function computeStreaks(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(dates)].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00Z`).getTime();
    const cur = new Date(`${sorted[i]}T00:00:00Z`).getTime();
    if (cur - prev === 86400000) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  const today = todayIso();
  const set = new Set(sorted);
  let current = 0;
  const cursor = new Date(`${today}T00:00:00Z`);
  if (!set.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return { current, longest: Math.max(longest, current) };
}

function resolveSession(request: Request): { sessionId: string; setCookie?: string } {
  let sessionId = readSession(request.headers.get('cookie'));
  if (sessionId) return { sessionId };
  sessionId = newSessionId();
  const secure = new URL(request.url).protocol === 'https:';
  return { sessionId, setCookie: sessionCookie(sessionId, secure) };
}

export const GET: APIRoute = async ({ request, params }) => {
  const path = params.path ?? '';
  const { sessionId, setCookie } = resolveSession(request);
  const logs = await readLogs(sessionId);
  const totalKm = logs.reduce((s, l) => s + l.km, 0);

  if (path === 'stage' || path.startsWith('stage/')) {
    return json(stageProgress(totalKm), 200, setCookie);
  }

  if (path === 'stages' || path.startsWith('stages/')) {
    let walked = 0;
    const data = STAGES.map((stage) => {
      const completed = totalKm >= walked + stage.distance;
      walked += stage.distance;
      return { ...stage, completed };
    });
    return json(
      { success: true, data, message: 'Stages retrieved', timestamp: new Date().toISOString() },
      200,
      setCookie
    );
  }

  if (path === 'metrics' || path.startsWith('metrics/')) {
    const today = todayIso();
    const weekStart = weekStartIso();
    const dailyKm = logs.find((l) => l.date === today)?.km ?? 0;
    const weeklyLogs = logs.filter((l) => l.date >= weekStart);
    const weeklyTotal = weeklyLogs.reduce((s, l) => s + l.km, 0);
    const best = logs.reduce((acc, l) => (l.km > acc.km ? l : acc), { km: 0, date: today });
    const streaks = computeStreaks(logs.map((l) => l.date));
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
          weeklyLogs.length > 0 ? Math.round((weeklyTotal / weeklyLogs.length) * 10) / 10 : 0,
        logs: weeklyLogs,
      },
      historical: {
        totalKm: Math.round(totalKm * 10) / 10,
        totalDays: logs.length,
        averageDaily: logs.length > 0 ? Math.round((totalKm / logs.length) * 10) / 10 : 0,
        logs,
        bestDay: best,
        streaks,
        route: {
          totalKm: TOTAL_ROUTE_KM,
          completedKm: Math.round(totalKm * 10) / 10,
          percent: Math.round((totalKm / TOTAL_ROUTE_KM) * 1000) / 10,
        },
      },
    };
    return json(
      { success: true, data, message: 'Metrics retrieved', timestamp: new Date().toISOString() },
      200,
      setCookie
    );
  }

  return json({ success: false, error: 'Not found' }, 404, setCookie);
};

export const POST: APIRoute = async ({ request, params }) => {
  const path = params.path ?? '';
  if (path !== 'log-km' && !path.startsWith('log-km/')) {
    return json({ success: false, error: 'Not found' }, 404);
  }

  const { sessionId, setCookie } = resolveSession(request);
  let body: { km?: number; date?: string };
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400, setCookie);
  }

  const km = Number(body.km);
  const date = body.date && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : todayIso();
  if (!Number.isFinite(km) || km < 0 || km > 80) {
    return json({ success: false, error: 'km must be between 0 and 80' }, 400, setCookie);
  }

  const logs = await readLogs(sessionId);
  const idx = logs.findIndex((l) => l.date === date);
  if (idx >= 0) logs[idx] = { km, date };
  else logs.push({ km, date });
  logs.sort((a, b) => a.date.localeCompare(b.date));
  await writeLogs(sessionId, logs);

  return json(
    {
      success: true,
      data: { km, date },
      message: 'Km logged',
      timestamp: new Date().toISOString(),
    },
    200,
    setCookie
  );
};
