/**
 * Field-level encryption for pilgrim PII (BOOK-00X).
 *
 * The `pilgrims` table has always named its PII columns with an `_encrypted`
 * suffix (see domain_model/schema.ts) but nothing ever actually encrypted
 * anything until now — this closes that gap.
 *
 * Model: AES-256-GCM, one random 12-byte IV per call, auth tag included in
 * the stored value so each column round-trips as a single opaque string with
 * no separate IV/tag column needed:
 *
 *   base64(iv) + ":" + base64(authTag) + ":" + base64(ciphertext)
 *
 * A tampered or corrupted value throws rather than silently decrypting to
 * garbage — a corrupted PII field must never be trusted downstream (form
 * display, government XML submission, etc).
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

/** Fail closed: null unless a well-formed key is configured. */
export function getEncryptionKey(
  env: NodeJS.ProcessEnv = process.env,
): Buffer | null {
  const raw = env.PILGRIM_ENCRYPTION_KEY;
  if (!raw) return null;
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return null;
  }
  if (key.length !== KEY_LENGTH) return null;
  return key;
}

export function encryptField(plaintext: string, key: Buffer): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
}

/** Throws if `stored` is malformed or the auth tag doesn't match. */
export function decryptField(stored: string, key: Buffer): string {
  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error("encrypted field: malformed stored value");
  }
  const [ivB64, tagB64, ciphertextB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

export function encryptBuffer(
  plaintext: Uint8Array,
  key: Buffer,
): { iv: Buffer; authTag: Buffer; ciphertext: Buffer } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext),
    cipher.final(),
  ]);
  return { iv, authTag: cipher.getAuthTag(), ciphertext };
}

/** Throws if the auth tag doesn't match. */
export function decryptBuffer(
  encrypted: { iv: Buffer; authTag: Buffer; ciphertext: Buffer },
  key: Buffer,
): Buffer {
  const decipher = createDecipheriv(ALGORITHM, key, encrypted.iv);
  decipher.setAuthTag(encrypted.authTag);
  return Buffer.concat([
    decipher.update(encrypted.ciphertext),
    decipher.final(),
  ]);
}

/**
 * Serialize an encrypted buffer for storage as a single R2 object body:
 * [4-byte IV length][IV][4-byte tag length][tag][ciphertext]
 */
export function packEncryptedBuffer(encrypted: {
  iv: Buffer;
  authTag: Buffer;
  ciphertext: Buffer;
}): Buffer {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(encrypted.iv.length, 0);
  header.writeUInt32BE(encrypted.authTag.length, 4);
  return Buffer.concat([
    header,
    encrypted.iv,
    encrypted.authTag,
    encrypted.ciphertext,
  ]);
}

export function unpackEncryptedBuffer(packed: Buffer): {
  iv: Buffer;
  authTag: Buffer;
  ciphertext: Buffer;
} {
  const ivLength = packed.readUInt32BE(0);
  const tagLength = packed.readUInt32BE(4);
  const iv = packed.subarray(8, 8 + ivLength);
  const authTag = packed.subarray(8 + ivLength, 8 + ivLength + tagLength);
  const ciphertext = packed.subarray(8 + ivLength + tagLength);
  return { iv, authTag, ciphertext };
}
