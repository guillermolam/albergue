/**
 * Session management using Cloudflare KV
 */

export interface Session {
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

export async function createSession(
  userId: string,
  token: string,
  kv: KV,
  ttl: number = 7 * 24 * 60 * 60
): Promise<void> {
  const session: Session = {
    userId,
    token,
    expiresAt: Date.now() + ttl,
    createdAt: Date.now(),
  };
  await kv.put(`session:${userId}`, JSON.stringify(session), {
    expirationTtl: ttl / (1000 * 60 * 60), // Convert to hours
  });
}

export async function getSession(userId: string, kv: KV): Promise<Session | null> {
  const sessionData = await kv.get(`session:${userId}`);
  if (!sessionData) return null;

  const session = JSON.parse(sessionData.text());

  // Check if session has expired
  if (session.expiresAt < Date.now()) {
    await kv.delete(`session:${userId}`);
    return null;
  }

  return session;
}

export async function deleteSession(userId: string, kv: KV): Promise<void> {
  await kv.delete(`session:${userId}`);
}

export async function invalidateUserSessions(userId: string, kv: KV): Promise<void> {
  // Get all sessions and invalidate this user's
  const keys = await kv.list({ prefix: 'session:' });
  for (const key of keys.keys) {
    const userIdInKey = key.name.split(':')[1];
    if (userIdInKey === userId) {
      await kv.delete(key.name);
    }
  }
}

export async function extendSession(
  userId: string,
  kv: KV,
  ttl: number = 7 * 24 * 60 * 60
): Promise<void> {
  const session = await getSession(userId, kv);
  if (session) {
    session.expiresAt = Date.now() + ttl;
    await kv.put(`session:${userId}`, JSON.stringify(session), {
      expirationTtl: ttl / (1000 * 60 * 60),
    });
  }
}
