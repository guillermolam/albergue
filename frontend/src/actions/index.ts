/**
 * Astro Actions (ASTRO-003 / BOOK-002–005).
 *
 * Draft steps persist in the server session. Bed claim, price, and payment
 * go through the Hono write API. The browser never posts a trusted total.
 */
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { BACKEND_API_URL, ADMIN_API_TOKEN } from 'astro:env/server';
import {
  AUTH_SESSION_KEY,
  BOOKING_STATUSES,
  type BookingQuote,
  type CreatePaymentIntentResponse,
  type LoginResponse,
} from '@albergue/api-contract';
import { backendJson } from '../lib/backend-api';
import {
  BOOKING_DRAFT_SESSION_KEY,
  attachBooking,
  attachQuote,
  isDraftReadyToSubmit,
  updateBookingBeds,
  updateBookingContact,
  updateBookingDates,
  updateBookingGuests,
  type BookingDraft,
  type BookingStep,
} from '../lib/booking-draft';

const isoDate = z.iso.date();

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
  session.set(BOOKING_DRAFT_SESSION_KEY, draft);
  return { step: draft.step };
}

/**
 * Shared body for admin-only actions (ADMIN-001): check the existing
 * Astro-session role, then attach the shared ADMIN_API_TOKEN the backend's
 * admin-gated routes require — server-side only, never sent to the client.
 */
async function callAdminBackendRoute<T>(
  role: App.Locals['role'],
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (role !== 'admin') {
    throw new ActionError({ code: 'FORBIDDEN', message: 'Admin access required.' });
  }
  if (!ADMIN_API_TOKEN) {
    throw new ActionError({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Admin API is not configured (ADMIN_API_TOKEN).',
    });
  }

  const result = await backendJson<T>(path, {
    ...init,
    headers: { authorization: `Bearer ${ADMIN_API_TOKEN}`, ...init.headers },
  });
  if (!result.ok) {
    throw new ActionError({
      code: result.status === 409 ? 'CONFLICT' : 'BAD_REQUEST',
      message: result.message,
    });
  }
  return result.data;
}

export const server = {
  auth: {
    /**
     * AUTH-002 login: browser → Action → backend verifies → server session.
     * The password crosses only this one POST; the session stores identity.
     */
    login: defineAction({
      input: z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
      handler: async (input, context) => {
        if (!context.session) {
          throw new ActionError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Sessions are not available on this deployment yet.',
          });
        }
        if (!BACKEND_API_URL) {
          throw new ActionError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Backend API is not configured (BACKEND_API_URL).',
          });
        }

        const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw new ActionError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        const envelope = (await response.json()) as { data?: LoginResponse };
        if (!envelope.data) {
          throw new ActionError({ code: 'BAD_GATEWAY', message: 'Malformed backend response' });
        }

        context.session.set(AUTH_SESSION_KEY, envelope.data);
        return { ok: true as const };
      },
    }),

    /** AUTH-002 logout: invalidate the server session. */
    logout: defineAction({
      handler: async (_input, context) => {
        context.session?.destroy();
        return { ok: true as const };
      },
    }),
  },

  beds: {
    /**
     * Admin-only bed claim/release (ADMIN-001). The browser only ever holds
     * an Astro session; the shared ADMIN_API_TOKEN the backend requires for
     * these routes is attached here, server-side, never sent to the client.
     */
    reserve: defineAction({
      input: z.object({
        bedId: z.coerce.number().int().min(1),
      }),
      handler: (input, context) =>
        callAdminBackendRoute<{ id: number; status: string }>(
          context.locals.role,
          `/api/beds/${input.bedId}/reserve`,
          { method: 'PATCH', body: JSON.stringify({}) }
        ),
    }),

    release: defineAction({
      input: z.object({
        bedId: z.coerce.number().int().min(1),
      }),
      handler: (input, context) =>
        callAdminBackendRoute<{ id: number; status: string }>(
          context.locals.role,
          `/api/beds/${input.bedId}/release`,
          { method: 'PATCH' }
        ),
    }),
  },

  bookings: {
    /** Admin-only booking status transition (e.g. reserved -> checked_in, or -> cancelled). */
    updateStatus: defineAction({
      input: z.object({
        bookingId: z.coerce.number().int().min(1),
        status: z.string().refine((v) => (BOOKING_STATUSES as readonly string[]).includes(v), {
          message: `status must be one of ${BOOKING_STATUSES.join(', ')}`,
        }),
      }),
      handler: (input, context) =>
        callAdminBackendRoute<null>(
          context.locals.role,
          `/api/bookings/${input.bookingId}/status`,
          { method: 'PATCH', body: JSON.stringify({ status: input.status }) }
        ),
    }),
  },

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
        guestCount: z.coerce.number().int().min(1).max(50),
      }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        return persistDraft(context.session, updateBookingGuests(current, input));
      },
    }),

    setBeds: defineAction({
      input: z.object({
        selectedBedId: z.string().min(1),
      }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        let draft = updateBookingBeds(current, { selectedBedIds: [input.selectedBedId] });
        if (draft.arrivalDate && draft.departureDate) {
          const bedId = Number(input.selectedBedId);
          if (!Number.isInteger(bedId) || bedId < 1) {
            throw new ActionError({ code: 'BAD_REQUEST', message: 'Invalid bed' });
          }
          const quoted = await backendJson<BookingQuote>('/api/bookings/quote', {
            method: 'POST',
            body: JSON.stringify({
              bedId,
              checkInDate: draft.arrivalDate,
              checkOutDate: draft.departureDate,
            }),
          });
          if (quoted.ok) {
            draft = attachQuote(draft, quoted.data);
          }
        }
        const result = await persistDraft(context.session, draft);
        return { ...result, quote: draft.quote };
      },
    }),

    /** Public read of real bed availability for the current draft's dates
     * -- lets client components (BedSelectionStep.tsx) fetch this without
     * needing BACKEND_API_URL, which is server-only. */
    getAvailableBeds: defineAction({
      input: z.object({
        checkInDate: isoDate,
        checkOutDate: isoDate,
      }),
      handler: async (input) => {
        const result = await backendJson<
          Array<{
            id: number;
            bedNumber: number;
            roomNumber: number;
            roomName: string;
            roomType: string | null;
            pricePerNight: string;
            currency: string | null;
          }>
        >(
          `/api/bookings/available-beds?checkInDate=${encodeURIComponent(input.checkInDate)}&checkOutDate=${encodeURIComponent(input.checkOutDate)}`
        );
        if (!result.ok) {
          throw new ActionError({
            code: result.status === 503 ? 'SERVICE_UNAVAILABLE' : 'BAD_REQUEST',
            message: result.message,
          });
        }
        return result.data;
      },
    }),

    setContact: defineAction({
      input: z.object({
        firstName: z.string().min(1).max(80),
        lastName1: z.string().min(1).max(80),
        lastName2: z.string().max(80).optional(),
        email: z.union([z.email(), z.literal('')]).optional(),
        phone: z.string().min(6).max(32),
        documentType: z.enum(['dni', 'nie', 'passport']),
        documentNumber: z.string().min(3).max(32),
        birthDate: isoDate,
        gender: z.enum(['male', 'female', 'other']),
        nationality: z.string().max(64).optional(),
        addressCountry: z.string().min(2).max(64),
        addressStreet: z.string().min(1).max(120),
        addressCity: z.string().min(1).max(80),
        addressPostalCode: z.string().min(3).max(16),
      }),
      handler: async (input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        const contact = {
          ...input,
          email: input.email || undefined,
        };
        return persistDraft(context.session, updateBookingContact(current, contact));
      },
    }),

    /**
     * Create pilgrim + booking on the backend (BOOK-001, BOOK-005).
     * Then mint a Redsys intent when configured (BOOK-004). Fail closed
     * if the backend is missing; pay-at-hostel if Redsys is 501.
     */
    submit: defineAction({
      handler: async (_input, context) => {
        const current = await context.session?.get<BookingDraft>(BOOKING_DRAFT_SESSION_KEY);
        if (!current || !isDraftReadyToSubmit(current) || !current.contact) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Booking draft is incomplete.',
          });
        }

        const pilgrim = await backendJson<{ id: number }>('/api/pilgrims', {
          method: 'POST',
          body: JSON.stringify({
            ...current.contact,
            consentGiven: true,
          }),
        });
        if (!pilgrim.ok) {
          throw new ActionError({
            code: pilgrim.status === 503 ? 'SERVICE_UNAVAILABLE' : 'BAD_REQUEST',
            message: pilgrim.message,
          });
        }

        const bedId = Number(current.selectedBedIds![0]);
        const booking = await backendJson<{
          id: number;
          referenceNumber: string;
        }>('/api/bookings', {
          method: 'POST',
          body: JSON.stringify({
            pilgrimId: pilgrim.data.id,
            checkInDate: current.arrivalDate,
            checkOutDate: current.departureDate,
            numberOfPersons: current.guestCount,
            bedId,
          }),
        });
        if (!booking.ok) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: booking.message,
          });
        }

        let draft = attachBooking(current, {
          bookingId: booking.data.id,
          bookingReference: booking.data.referenceNumber,
        });
        await persistDraft(context.session, draft);

        const intent = await backendJson<CreatePaymentIntentResponse>('/api/payments/intent', {
          method: 'POST',
          body: JSON.stringify({ bookingReference: booking.data.referenceNumber }),
        });

        return {
          step: draft.step,
          bookingReference: booking.data.referenceNumber,
          payment: intent.ok
            ? {
                provider: intent.data.provider,
                clientToken: intent.data.clientToken,
                signature: intent.data.signature,
                gatewayUrl: intent.data.gatewayUrl,
                reference: intent.data.reference,
              }
            : { unavailable: true as const, reason: intent.message },
        };
      },
    }),
  },

  contact: {
    /** Public contact-form submission -- no session, no admin token. */
    submit: defineAction({
      input: z.object({
        name: z.string().min(1).max(120),
        email: z.email(),
        subject: z.string().max(200).optional(),
        message: z.string().min(1).max(4000),
      }),
      handler: async (input) => {
        const result = await backendJson('/api/contact-messages', {
          method: 'POST',
          body: JSON.stringify(input),
        });
        if (!result.ok) {
          throw new ActionError({ code: 'BAD_REQUEST', message: result.message });
        }
        return { ok: true as const };
      },
    }),
  },
};

// Type-only import placed at the bottom to keep the action definitions readable.
import type { APIContext } from 'astro';
type ActionAPIContext = APIContext;
