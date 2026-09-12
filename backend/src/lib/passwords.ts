/**
 * Password hashing (AUTH-001). scrypt via node:crypto — no new dependencies.
 * Stored format: scrypt$N$r$p$saltB64$hashB64
 */

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P })) as Buffer;
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');

  const hash = (await scryptAsync(password, salt, expected.length, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
  })) as Buffer;

  return hash.length === expected.length && timingSafeEqual(hash, expected);
}

let dummyHash: string | null = null;

/**
 * Verify against the stored hash, or against a dummy when the user does not
 * exist — keeps the not-found path on the same scrypt cost so login timing
 * does not disclose which usernames exist.
 */
export async function verifyPasswordOrDummy(
  password: string,
  stored: string | null
): Promise<boolean> {
  if (stored !== null) return verifyPassword(password, stored);
  dummyHash ??= await hashPassword('timing-equalization-dummy');
  await verifyPassword(password, dummyHash);
  return false;
}
