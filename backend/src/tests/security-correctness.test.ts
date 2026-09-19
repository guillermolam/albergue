import { describe, expect, it } from "vitest";
import { createBookingsBatch } from "../commands/bookings.js";
import { bulkUpdateBookings } from "../commands/bookings.js";
import { bulkUpdateBeds } from "../commands/beds.js";
import { bulkDeleteUsers } from "../commands/users.js";

describe("Phase 1 security and correctness guards", () => {
  it("rejects duplicate bed claims before starting batch writes", async () => {
    await expect(
      createBookingsBatch([
        { bedAssignmentId: 7 } as never,
        { bedAssignmentId: 7 } as never,
      ]),
    ).rejects.toThrow("more than one booking");
  });

  it("treats empty bulk ID sets as no-ops", async () => {
    await expect(bulkUpdateBookings([], {})).resolves.toBe(0);
    await expect(bulkUpdateBeds([], {})).resolves.toBe(0);
    await expect(bulkDeleteUsers([])).resolves.toBe(0);
  });

  it("hashes passwords with scrypt and verifies them timing-safe", async () => {
    const { hashPassword, verifyPassword, verifyPasswordOrDummy } =
      await import("../lib/passwords.js");

    const stored = await hashPassword("correct horse battery staple");
    expect(stored).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(stored).not.toContain("correct horse");

    await expect(
      verifyPassword("correct horse battery staple", stored),
    ).resolves.toBe(true);
    await expect(verifyPassword("wrong", stored)).resolves.toBe(false);
    // Unknown-user path: same scrypt cost, always false
    await expect(verifyPasswordOrDummy("anything", null)).resolves.toBe(false);
  });
});
