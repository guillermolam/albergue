import type { Bed, Bunk, BunkVisualStatus } from './types';

const OPERATIONAL_OVERRIDE: ReadonlySet<Bed['status']> = new Set(['blocked', 'maintenance']);

/** A bunk's visual status is derived from its beds, never stored directly
 * (section 13 of the migration spec). An operational override (blocked or
 * under maintenance) on ANY bed takes precedence over plain occupancy,
 * since staff need that signal to stay visible regardless of how many
 * beds are otherwise free. */
export function deriveBunkStatus(bunk: Pick<Bunk, 'beds'>): BunkVisualStatus {
  if (bunk.beds.length === 0) return 'unavailable';
  if (bunk.beds.some((bed) => OPERATIONAL_OVERRIDE.has(bed.status))) {
    return 'operational-override';
  }
  const availableCount = bunk.beds.filter((bed) => bed.status === 'available').length;
  if (availableCount === bunk.beds.length) return 'available';
  if (availableCount > 0) return 'limited';
  return 'unavailable';
}

export function countAvailableBeds(bunks: Pick<Bunk, 'beds'>[]): number {
  return bunks.reduce(
    (total, bunk) => total + bunk.beds.filter((bed) => bed.status === 'available').length,
    0
  );
}
