/**
 * Password hashing (AUTH-001). scrypt via node:crypto — no new dependencies.
 * Stored format: scrypt$N$r$p$saltB64$hashB64
 */

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

interface ScryptOptions {
  N: number;
  r: number;
  p: number;
}

/** promisify(scrypt) loses the options overload on older @types/node. */
function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) =>
      err ? reject(err) : resolve(derivedKey)
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');

  const hash = await scryptAsync(password, salt, expected.length, {
    N: Number(nStr),
    r: Number(rStr),
    p: Number(pStr),
  });

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
