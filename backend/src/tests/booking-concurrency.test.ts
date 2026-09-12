import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ bedAvailable: true, inserts: 0 }));

vi.mock('../lib/db.js', () => {
  const tx = {
    update: () => ({
      set: (values: Record<string, unknown>) => ({
        where: () => ({
          returning: async () => {
            if (values.isAvailable === false) {
              if (!state.bedAvailable) return [];
              state.bedAvailable = false;
              return [{ id: 9 }];
            }
            return [{}];
          },
        }),
      }),
    }),
    insert: () => ({
      values: (values: Record<string, unknown>) => ({
        returning: async () => {
          state.inserts++;
          return [{ id: state.inserts, ...values }];
        },
      }),
    }),
  };

  return { db: { transaction: (callback: (transaction: typeof tx) => unknown) => callback(tx) } };
});

import { createBooking } from '../commands/bookings.js';

describe('transactional bed claims', () => {
  beforeEach(() => {
    state.bedAvailable = true;
    state.inserts = 0;
  });

  it('allows only one concurrent booking to claim a bed', async () => {
    const input = {
      bedAssignmentId: 9,
      reservationExpiresAt: new Date('2030-01-01T12:00:00Z'),
    } as never;

    const results = await Promise.allSettled([createBooking(input), createBooking(input)]);

    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(({ status }) => status === 'rejected')).toHaveLength(1);
    expect(state.inserts).toBe(1);
  });
});
