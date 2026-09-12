/**
 * Booking draft — session-carried wizard state (ASTRO-002).
 *
 * Rules (MIGRATION_PLAN):
 * - session state is NOT bed-allocation authority — the backend re-validates
 *   availability and claims beds atomically at submission time;
 * - drafts expire; `expiresAt` is authoritative, not the cookie lifetime;
 * - Node in-memory sessions are not suitable for horizontally scaled
 *   production — the Cloudflare KV driver (`SESSION` binding) is the
 *   production driver and must be provisioned before Phase 4.
 */

export const BOOKING_DRAFT_SESSION_KEY = "bookingDraft" as const;
export const BOOKING_DRAFT_VERSION = 1 as const;
/** Drafts are abandoned-cart state; 30 minutes matches the reservation window. */
export const BOOKING_DRAFT_TTL_MS = 30 * 60 * 1000;

export type BookingStep = "dates" | "guests" | "beds" | "contact" | "payment";

export interface BookingDraft {
  version: typeof BOOKING_DRAFT_VERSION;
  draftId: string;
  step: BookingStep;
  /** ISO 8601 date (YYYY-MM-DD). */
  arrivalDate?: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  departureDate?: string;
  guestCount?: number;
  selectedBedIds?: string[];
  /** ISO 8601 datetime after which the draft is discarded. */
  expiresAt: string;
}

export function createBookingDraft(now: Date = new Date()): BookingDraft {
  return {
    version: BOOKING_DRAFT_VERSION,
    draftId: crypto.randomUUID(),
    step: "dates",
    expiresAt: new Date(now.getTime() + BOOKING_DRAFT_TTL_MS).toISOString(),
  };
}

export function isDraftExpired(draft: BookingDraft, now: Date = new Date()): boolean {
  return Date.parse(draft.expiresAt) <= now.getTime();
}

/** Resume the live draft or start a fresh one when missing/expired. */
function baseDraft(current: BookingDraft | undefined, now: Date): BookingDraft {
  return !current || isDraftExpired(current, now) ? createBookingDraft(now) : { ...current };
}

export function updateBookingDates(
  current: BookingDraft | undefined,
  input: { arrivalDate: string; departureDate: string },
  now: Date = new Date(),
): BookingDraft {
  const draft = baseDraft(current, now);
  draft.arrivalDate = input.arrivalDate;
  draft.departureDate = input.departureDate;
  draft.step = "guests";
  return draft;
}

export function updateBookingGuests(
  current: BookingDraft | undefined,
  input: { guestCount: number },
  now: Date = new Date(),
): BookingDraft {
  const draft = baseDraft(current, now);
  draft.guestCount = input.guestCount;
  draft.step = "beds";
  return draft;
}

export function updateBookingBeds(
  current: BookingDraft | undefined,
  input: { selectedBedIds: string[] },
  now: Date = new Date(),
): BookingDraft {
  const draft = baseDraft(current, now);
  draft.selectedBedIds = input.selectedBedIds;
  draft.step = "contact";
  return draft;
}
