import { describe, expect, it } from 'vitest';
import { createBookingsBatch } from '../commands/bookings.js';
import { bulkUpdateBookings } from '../commands/bookings.js';
import { bulkUpdateBeds } from '../commands/beds.js';
import { bulkDeleteUsers, createUser, updateUserPassword } from '../commands/users.js';

describe('Phase 1 security and correctness guards', () => {
  it('rejects duplicate bed claims before starting batch writes', async () => {
    await expect(
      createBookingsBatch([
        { bedAssignmentId: 7 } as never,
        { bedAssignmentId: 7 } as never,
      ])
    ).rejects.toThrow('more than one booking');
  });

  it('treats empty bulk ID sets as no-ops', async () => {
    await expect(bulkUpdateBookings([], {})).resolves.toBe(0);
    await expect(bulkUpdateBeds([], {})).resolves.toBe(0);
    await expect(bulkDeleteUsers([])).resolves.toBe(0);
  });

  it('fails closed instead of persisting plaintext passwords', async () => {
    await expect(createUser({ username: 'admin', password: 'plaintext' } as never)).rejects.toThrow(
      'secure password hashing'
    );
    await expect(updateUserPassword(1, 'plaintext')).rejects.toThrow('secure password hashing');
  });
});
