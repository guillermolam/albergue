/**
 * Booking API contract.
 * Field types mirror domain_model/schema.ts: `date` columns are 'YYYY-MM-DD'
 * strings, `timestamp` columns are ISO 8601 strings on the wire, and
 * `decimal` columns are decimal strings ("45.00") — never JS numbers.
 */

/** Booking lifecycle — mirrors `bookings.status`. */
export type BookingStatus =
  | "reserved"
  | "checked_in"
  | "checked_out"
  | "completed"
  | "cancelled"
  | "expired"
  | "deleted";

export const BOOKING_STATUSES: readonly BookingStatus[] = [
  "reserved",
  "checked_in",
  "checked_out",
  "completed",
  "cancelled",
  "expired",
  "deleted",
];

export interface CreateBookingRequest {
  pilgrimId: number;
  /** YYYY-MM-DD */
  checkInDate: string;
  /** YYYY-MM-DD */
  checkOutDate: string;
  numberOfPersons?: number;
  numberOfRooms?: number;
  hasInternet?: boolean;
  estimatedArrivalTime?: string;
  notes?: string;
  /** Bed to claim atomically with the booking. */
  bedId?: number;
  /**
   * Decimal string, e.g. "45.00". Client-side estimate only — the server
   * recomputes authoritatively from the bed row when `bedId` is present
   * (BOOK-001). Required only for bed-less staff bookings.
   */
  totalAmount?: string;
  /** ISO 8601. Server assigns a default when omitted. */
  reservationExpiresAt?: string;
  /** ISO 8601. Server assigns a default when omitted. */
  paymentDeadline?: string;
  /** Server-generated (unguessable) when omitted. */
  referenceNumber?: string;
}

/** BOOK-001: pre-submit price quote request. */
export interface BookingQuoteRequest {
  bedId: number;
  /** YYYY-MM-DD */
  checkInDate: string;
  /** YYYY-MM-DD */
  checkOutDate: string;
}

/** BOOK-001: authoritative server-computed quote. */
export interface BookingQuote {
  bedId: number;
  numberOfNights: number;
  /** Decimal string. */
  pricePerNight: string;
  /** Decimal string. */
  totalAmount: string;
  currency: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface BookingSummary {
  id: number;
  referenceNumber: string;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  /** Decimal string. */
  totalAmount: string;
  currency: "EUR";
}

export interface CreateBedReservationRequest {
  /** ISO 8601 datetime until which the bed is held. */
  reservedUntil: string;
}
