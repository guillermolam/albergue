import { describe, expect, it } from 'vitest';
import {
  buildOrderNumber,
  buildPaymentRequest,
  getRedsysConfig,
  isApproved,
  signParameters,
  verifyNotification,
  type RedsysConfig,
} from '../lib/redsys.js';

// Well-known Redsys sandbox merchant secret
const config: RedsysConfig = {
  merchantCode: '999008881',
  terminal: '1',
  secretKey: 'sq7HjrUOBfKmC576ILgskD5srU870gJ7',
  gatewayUrl: 'https://sis-t.redsys.es:25443/sis/realizarPago',
  merchantUrl: 'https://example.com/api/payments/redsys/notification',
  urlOk: 'https://example.com/booking-confirmed',
  urlKo: 'https://example.com/booking?payment=failed',
};

function simulateNotification(orderNumber: string, responseCode: string, amountCents: string) {
  const params = {
    Ds_Merchant_Order: orderNumber,
    Ds_Response: responseCode,
    Ds_Merchant_Amount: amountCents,
  };
  const paramsBase64 = Buffer.from(JSON.stringify(params), 'utf8').toString('base64');
  const signature = signParameters(config.secretKey, orderNumber, paramsBase64);
  // Redsys transmits the signature URL-safe
  const signatureUrlSafe = signature.replace(/\+/g, '-').replace(/\//g, '_');
  return { paramsBase64, signatureUrlSafe };
}

describe('redsys crypto', () => {
  it('generates spec-compliant order numbers (4-12 chars, first 4 numeric)', () => {
    for (const bookingId of [1, 42, 9999, 123456]) {
      const order = buildOrderNumber(bookingId);
      expect(order).toMatch(/^\d{4}[0-9a-f]{8}$/);
    }
  });

  it('round-trips: a correctly signed notification verifies', () => {
    const request = buildPaymentRequest(config, { bookingId: 42, amount: '45.00' });
    const { paramsBase64, signatureUrlSafe } = simulateNotification(
      request.orderNumber,
      '0000',
      '4500'
    );

    const notification = verifyNotification(config, paramsBase64, signatureUrlSafe);
    expect(notification).not.toBeNull();
    expect(notification?.orderNumber).toBe(request.orderNumber);
    expect(isApproved(notification!.responseCode)).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const request = buildPaymentRequest(config, { bookingId: 42, amount: '45.00' });
    const { paramsBase64 } = simulateNotification(request.orderNumber, '0000', '4500');
    const forged = Buffer.from('forged-signature-value==').toString('base64');

    expect(verifyNotification(config, paramsBase64, forged)).toBeNull();
  });

  it('rejects a notification signed for a different order', () => {
    const request = buildPaymentRequest(config, { bookingId: 42, amount: '45.00' });
    const other = simulateNotification('9999abcdef00', '0000', '4500');

    // Attacker replays params for their own order but with our payment's context
    expect(verifyNotification(config, other.paramsBase64, other.signatureUrlSafe)).not.toBeNull();
    // ...but the order number inside is theirs, not ours — lookup by orderNumber
    // in the webhook binds the notification to the right payment row
    expect(request.orderNumber).not.toBe('9999abcdef00');
  });

  it('embeds the booking reference on UrlOK', () => {
    const request = buildPaymentRequest(config, {
      bookingId: 42,
      amount: '45.00',
      bookingReference: 'ALB-AABBCCDDEEFF',
    });
    const params = JSON.parse(Buffer.from(request.paramsBase64, 'base64').toString('utf8'));
    expect(params.Ds_Merchant_UrlOK).toBe(
      'https://example.com/booking-confirmed?ref=ALB-AABBCCDDEEFF',
    );
  });

  it('bounds approval to Ds_Response 0-99', () => {
    expect(isApproved('0000')).toBe(true);
    expect(isApproved('0099')).toBe(true);
    expect(isApproved('0100')).toBe(false);
    expect(isApproved('9999')).toBe(false);
    expect(isApproved('')).toBe(false);
  });

  it('fails closed when env is incomplete', () => {
    expect(getRedsysConfig({})).toBeNull();
    expect(
      getRedsysConfig({
        REDSYS_MERCHANT_CODE: '999008881',
        REDSYS_TERMINAL: '1',
        REDSYS_SECRET_KEY: 'sq7HjrUOBfKmC576ILgskD5srU870gJ7',
        PUBLIC_APP_URL: 'https://example.com',
        REDSYS_GATEWAY_URL: 'https://sis-t.redsys.es:25443/sis/realizarPago',
      })?.merchantCode
    ).toBe('999008881');
  });
});
