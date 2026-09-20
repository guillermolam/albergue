/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { countAvailableBeds, deriveBunkStatus } from '../../react/spatial/domain/bunkStatus';
import type { Bed, Bunk } from '../../react/spatial/domain/types';

function bed(bedId: number, level: Bed['level'], status: Bed['status']): Bed {
  return { bedId, level, status };
}

function bunk(beds: Bed[]): Pick<Bunk, 'beds'> {
  return { beds };
}

describe('deriveBunkStatus', () => {
  it('is available when every bed is available', () => {
    expect(
      deriveBunkStatus(bunk([bed(1, 'lower', 'available'), bed(2, 'upper', 'available')]))
    ).toBe('available');
  });

  it('is limited when only some beds are available', () => {
    expect(
      deriveBunkStatus(bunk([bed(1, 'lower', 'available'), bed(2, 'upper', 'reserved')]))
    ).toBe('limited');
  });

  it('is unavailable when no bed is available', () => {
    expect(deriveBunkStatus(bunk([bed(1, 'lower', 'reserved'), bed(2, 'upper', 'occupied')]))).toBe(
      'unavailable'
    );
  });

  it('is unavailable for a bunk with no beds', () => {
    expect(deriveBunkStatus(bunk([]))).toBe('unavailable');
  });

  it('a single lower-only bed (no bunk) behaves the same as any other bed', () => {
    expect(deriveBunkStatus(bunk([bed(1, 'lower', 'available')]))).toBe('available');
  });

  it('an operational override (blocked/maintenance) takes precedence over plain occupancy', () => {
    expect(
      deriveBunkStatus(bunk([bed(1, 'lower', 'available'), bed(2, 'upper', 'maintenance')]))
    ).toBe('operational-override');
    expect(deriveBunkStatus(bunk([bed(1, 'lower', 'blocked'), bed(2, 'upper', 'blocked')]))).toBe(
      'operational-override'
    );
  });
});

describe('countAvailableBeds', () => {
  it('sums available beds across bunks', () => {
    const bunks = [
      bunk([bed(1, 'lower', 'available'), bed(2, 'upper', 'available')]),
      bunk([bed(3, 'lower', 'reserved'), bed(4, 'upper', 'available')]),
      bunk([bed(5, 'lower', 'occupied')]),
    ];
    expect(countAvailableBeds(bunks)).toBe(3);
  });

  it('returns 0 for no bunks', () => {
    expect(countAvailableBeds([])).toBe(0);
  });
});
