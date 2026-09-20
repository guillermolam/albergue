/**
 * Pure unit-conversion helpers for the Smplrspace serialization boundary.
 * This application's domain model uses meters internally; Smplrspace
 * persists opening dimensions in centimeters. Nothing here performs
 * rounding -- floating-point results are returned as-is, so a caller
 * that needs a rounded value must round explicitly.
 */

const CENTIMETERS_PER_METER = 100;

/**
 * Guards against non-finite input (NaN, +Infinity, -Infinity) while
 * explicitly allowing negative values, since coordinates and offsets
 * can legitimately be negative in this coordinate system.
 */
export function assertFiniteNumber(value: number, fieldName: string): number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${fieldName} must be a finite number, received: ${String(value)}`);
  }
  return value;
}

export function metersToCentimeters(meters: number): number {
  assertFiniteNumber(meters, 'meters');
  return meters * CENTIMETERS_PER_METER;
}

export function centimetersToMeters(centimeters: number): number {
  assertFiniteNumber(centimeters, 'centimeters');
  return centimeters / CENTIMETERS_PER_METER;
}
