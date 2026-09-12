/**
 * Astro Actions scaffold (ASTRO-003).
 *
 * Actions mutate the session-carried booking draft only. They never allocate
 * beds or take payment — submission goes through the backend write API
 * (ARCH-005) in Phase 4.
 */
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import {
  BOOKING_DRAFT_SESSION_KEY,
  updateBookingDates,
  updateBookingGuests,
  updateBookingBeds,
  type BookingDraft,
  type BookingStep,
} from '../lib/booking-draft';

const isoDate = z.string().date();

async function persistDraft(
  session: ActionAPIContext['session'],
  draft: BookingDraft
): Promise<{ step: BookingStep }> {
  if (!session) {
    // Adapter has no session driver (SESSION KV binding not provisioned yet).
    throw new ActionError({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Booking sessions are not available on this deployment yet.',
    });
  }
  await session.set(BOOKING_DRAFT_SESSION_KEY, draft);
  return { step: draft.step };
}

export const server = {
  booking: {
    setDates: defineAction({
      input: z
        .object({
          arrivalDate: isoDate,
          departureDate: isoDate,
        })
        .refine((v) => v.departureDate > v.arrivalDate, {
          message: 'departureDate must be after arrivalDate',
        }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        return persistDraft(context.session, updateBookingDates(current, input));
      },
    }),

    setGuests: defineAction({
      input: z.object({
        guestCount: z.number().int().min(1).max(50),
      }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        return persistDraft(context.session, updateBookingGuests(current, input));
      },
    }),

    setBeds: defineAction({
      input: z.object({
        selectedBedIds: z.array(z.string().min(1)).min(1).max(50),
      }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        return persistDraft(context.session, updateBookingBeds(current, input));
      },
    }),
  },
};

// Type-only import placed at the bottom to keep the action definitions readable.
import type { APIContext } from 'astro';
type ActionAPIContext = APIContext;
