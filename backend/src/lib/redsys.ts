/**
 * Redsys (Sermepa) payment boundary (BOOK-004).
 *
 * Model: redirect/tokenization — the browser posts Ds_MerchantParameters +
 * Ds_Signature straight to the Redsys gateway. Card data never transits this
 * system; we only mint and verify opaque signed parameter blobs.
 *
 * Crypto per Redsys spec:
 *  1. merchant parameters JSON → base64  (Ds_MerchantParameters)
 *  2. per-transaction key = 3DES-CBC(base64 secret, zero IV) over the
 *     zero-padded order number
 *  3. signature = base64(HMAC-SHA256(derived key, Ds_MerchantParameters))
 * Notifications carry the signature URL-safe base64-encoded; verified with a
 * timing-safe comparison after normalisation.
 */

import { createCipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export interface RedsysConfig {
  merchantCode: string;
  terminal: string;
  /** Base64-encoded merchant secret (SHA-256 key) from the Redsys backoffice. */
  secretKey: string;
  /** Test: https://sis-t.redsys.es:25443/sis/realizarPago — Prod: https://sis.redsys.es/sis/realizarPago */
  gatewayUrl: string;
  /** Absolute webhook URL Redsys posts the result to. */
  merchantUrl: string;
  urlOk: string;
  urlKo: string;
}

/** Fail closed: null unless every required variable is configured. */
export function getRedsysConfig(env: NodeJS.ProcessEnv = process.env): RedsysConfig | null {
  const {
    REDSYS_MERCHANT_CODE,
    REDSYS_TERMINAL,
    REDSYS_SECRET_KEY,
    REDSYS_GATEWAY_URL,
    PUBLIC_APP_URL,
  } = env;
  if (!REDSYS_MERCHANT_CODE || !REDSYS_TERMINAL || !REDSYS_SECRET_KEY || !PUBLIC_APP_URL) {
    return null;
  }
  return {
    merchantCode: REDSYS_MERCHANT_CODE,
    terminal: REDSYS_TERMINAL,
    secretKey: REDSYS_SECRET_KEY,
    gatewayUrl:
      REDSYS_GATEWAY_URL ?? 'https://sis-t.redsys.es:25443/sis/realizarPago',
    merchantUrl: `${PUBLIC_APP_URL}/api/payments/redsys/notification`,
    urlOk: `${PUBLIC_APP_URL}/booking-confirmed`,
    urlKo: `${PUBLIC_APP_URL}/booking?payment=failed`,
  };
}

const EUR_NUMERIC = '978';

/** Redsys order numbers: 4–12 chars, first four numeric. Unique per attempt. */
export function buildOrderNumber(bookingId: number): string {
  const numericPrefix = String(bookingId % 10000).padStart(4, '0');
  return `${numericPrefix}${randomBytes(4).toString('hex')}`;
}

function deriveTransactionKey(secretKeyB64: string, orderNumber: string): Buffer {
  const key = Buffer.from(secretKeyB64, 'base64');
  const padded = Buffer.alloc(Math.ceil(orderNumber.length / 8) * 8);
  Buffer.from(orderNumber, 'utf8').copy(padded);
  const cipher = createCipheriv('des-ede3-cbc', key, Buffer.alloc(8));
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(padded), cipher.final()]);
}

export function signParameters(
  secretKeyB64: string,
  orderNumber: string,
  paramsBase64: string
): string {
  return createHmac('sha256', deriveTransactionKey(secretKeyB64, orderNumber))
    .update(paramsBase64)
    .digest('base64');
}

export interface RedsysPaymentRequest {
  /** Ds_MerchantParameters — the opaque client token. */
  paramsBase64: string;
  /** Ds_Signature */
  signature: string;
  gatewayUrl: string;
  orderNumber: string;
}

export function buildPaymentRequest(
  config: RedsysConfig,
  input: {
    bookingId: number;
    /** decimal string, e.g. "45.00" */
    amount: string;
    locale?: string;
    bookingReference?: string;
  }
): RedsysPaymentRequest {
  const orderNumber = buildOrderNumber(input.bookingId);
  const amountCents = String(Math.round(Number(input.amount) * 100));

  const params = {
    Ds_Merchant_Amount: amountCents,
    Ds_Merchant_Order: orderNumber,
    Ds_Merchant_MerchantCode: config.merchantCode,
    Ds_Merchant_Currency: EUR_NUMERIC,
    Ds_Merchant_TransactionType: '0', // authorization
    Ds_Merchant_Terminal: config.terminal,
    Ds_Merchant_MerchantURL: config.merchantUrl,
    Ds_Merchant_UrlOK: input.bookingReference
      ? `${config.urlOk}?ref=${encodeURIComponent(input.bookingReference)}`
      : config.urlOk,
    Ds_Merchant_UrlKO: config.urlKo,
    Ds_Merchant_ConsumerLanguage: input.locale === 'en' ? '002' : '001',
  };

  const paramsBase64 = Buffer.from(JSON.stringify(params), 'utf8').toString('base64');
  return {
    paramsBase64,
    signature: signParameters(config.secretKey, orderNumber, paramsBase64),
    gatewayUrl: config.gatewayUrl,
    orderNumber,
  };
}

export interface RedsysNotification {
  orderNumber: string;
  /** Ds_Response — approved when 0–99. */
  responseCode: string;
  amountCents: string;
  raw: Record<string, string>;
}

/** Verify a notification's signature; null when invalid. Timing-safe. */
export function verifyNotification(
  config: RedsysConfig,
  paramsBase64: string,
  signatureUrlSafe: string
): RedsysNotification | null {
  let params: Record<string, string>;
  try {
    params = JSON.parse(Buffer.from(paramsBase64, 'base64').toString('utf8'));
  } catch {
    return null;
  }

  const orderNumber = params.Ds_Merchant_Order;
  if (!orderNumber) return null;

  const expected = signParameters(config.secretKey, orderNumber, paramsBase64);
  const received = Buffer.from(signatureUrlSafe.replace(/-/g, '+').replace(/_/g, '/'));
  const expectedBuf = Buffer.from(expected);
  if (received.length !== expectedBuf.length || !timingSafeEqual(received, expectedBuf)) {
    return null;
  }

  return {
    orderNumber,
    responseCode: params.Ds_Response ?? '',
    amountCents: params.Ds_Merchant_Amount ?? '',
    raw: params,
  };
}

/** Redsys approval: Ds_Response 0000–0099. Empty/non-numeric is never approved. */
export function isApproved(responseCode: string): boolean {
  if (!/^\d+$/.test(responseCode)) return false;
  const n = Number(responseCode);
  return n >= 0 && n <= 99;
}
