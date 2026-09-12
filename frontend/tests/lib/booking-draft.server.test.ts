/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import {
  attachBooking,
  attachQuote,
  createBookingDraft,
  isDraftExpired,
  isDraftReadyToSubmit,
  updateBookingBeds,
  updateBookingContact,
  updateBookingDates,
  updateBookingGuests,
} from '../../src/lib/booking-draft';

const contact = {
  firstName: 'Ana',
  lastName1: 'López',
  phone: '+34600111222',
  documentType: 'dni',
  documentNumber: '12345678Z',
  birthDate: '1990-01-15',
  gender: 'female',
  addressCountry: 'ES',
  addressStreet: 'Calle Mayor 1',
  addressCity: 'Cáceres',
  addressPostalCode: '10001',
};

describe('booking draft', () => {
  it('starts on dates and expires after TTL', () => {
    const now = new Date('2026-09-12T10:00:00.000Z');
    const draft = createBookingDraft(now);
    expect(draft.step).toBe('dates');
    expect(isDraftExpired(draft, now)).toBe(false);
    expect(isDraftExpired(draft, new Date('2026-09-12T10:31:00.000Z'))).toBe(true);
  });

  it('advances dates → guests → beds → contact → payment', () => {
    let draft = updateBookingDates(undefined, {
      arrivalDate: '2026-09-20',
      departureDate: '2026-09-22',
    });
    expect(draft.step).toBe('guests');
    draft = updateBookingGuests(draft, { guestCount: 1 });
    expect(draft.step).toBe('beds');
    draft = updateBookingBeds(draft, { selectedBedIds: ['3'] });
    expect(draft.step).toBe('contact');
    draft = updateBookingContact(draft, contact);
    expect(draft.step).toBe('payment');
    expect(isDraftReadyToSubmit(draft)).toBe(true);
  });

  it('clears a stale quote when the bed changes', () => {
    let draft = updateBookingDates(undefined, {
      arrivalDate: '2026-09-20',
      departureDate: '2026-09-22',
    });
    draft = updateBookingGuests(draft, { guestCount: 1 });
    draft = updateBookingBeds(draft, { selectedBedIds: ['1'] });
    draft = attachQuote(draft, {
      bedId: 1,
      numberOfNights: 2,
      pricePerNight: '15.00',
      totalAmount: '30.00',
      currency: 'EUR',
    });
    draft = updateBookingBeds(draft, { selectedBedIds: ['2'] });
    expect(draft.quote).toBeUndefined();
    expect(draft.selectedBedIds).toEqual(['2']);
  });

  it('stores the unguessable booking reference after commit', () => {
    const draft = attachBooking(createBookingDraft(), {
      bookingId: 9,
      bookingReference: 'ALB-AABBCCDDEEFF',
    });
    expect(draft.bookingReference).toBe('ALB-AABBCCDDEEFF');
  });
});
