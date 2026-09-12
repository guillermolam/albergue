/**
 * Payment API contract (BOOK-004).
 *
 * The browser communicates card details directly with the PSP; Astro and the
 * backend only ever see opaque references. No PAN touches this system.
 */

/** Providers the boundary supports. The concrete choice is a Phase 4 decision. */
export type PaymentProvider = 'stripe' | 'redsys';

/** Opaque PSP handle — the only payment artefact this system stores. */
export interface PaymentIntentReference {
  provider: PaymentProvider;
  /** PSP-side intent/session id. Never card data. */
  reference: string;
}

export interface CreatePaymentIntentRequest {
  /** Unguessable booking reference (BOOK-005). */
  bookingReference: string;
}

export interface CreatePaymentIntentResponse {
  provider: PaymentProvider;
  /** PSP client token (Redsys: Ds_MerchantParameters, base64). */
  clientToken: string;
  /** Redsys: Ds_Signature. Posted with clientToken to gatewayUrl. */
  signature?: string;
  /** Redsys: gateway the browser posts to. */
  gatewayUrl?: string;
  reference: string;
}
