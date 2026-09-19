/**
 * Dashboard Queries
 * Aggregate reads composed from the bookings/pilgrims/beds domains, for the
 * admin dashboard overview.
 */

import { getBookingStats, getRecentBookings } from "./bookings.js";
import { getPilgrimStats } from "./pilgrims.js";
import { getBedStats } from "./beds.js";
import type { DashboardMetrics } from "../types/index.js";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [bookingStats, pilgrimStats, bedStats, recentBookings] = await Promise.all([
    getBookingStats(),
    getPilgrimStats(),
    getBedStats(),
    getRecentBookings(5),
  ]);

  return {
    bookings: bookingStats,
    pilgrims: pilgrimStats,
    beds: bedStats,
    recentActivity: recentBookings.map((booking) => ({
      type: "booking",
      id: booking.id,
      timestamp: booking.createdAt ?? new Date(),
      description: `Booking ${booking.referenceNumber} — ${booking.status}`,
    })),
  };
}
