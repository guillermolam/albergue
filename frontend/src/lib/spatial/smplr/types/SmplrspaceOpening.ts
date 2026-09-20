import type { SmplrspacePoint } from './SmplrspacePoint';

/**
 * Opening kinds observed in the persisted Smplrspace format. Only the
 * two kinds actually documented/observed are modelled -- extend this
 * union only once another kind is confirmed, rather than guessing.
 */
export type SmplrspaceOpeningType = 'door' | 'window';

/**
 * Where an opening sits along its wall segment: measured as a distance
 * from a reference point. The unit of `distance` is not documented
 * separately from the reference point's own coordinate unit, so no
 * conversion is applied to it (unlike `dimensions`, see below).
 */
export interface SmplrspaceOpeningPosition {
  readonly from: SmplrspacePoint;
  readonly distance: number;
}

/**
 * Opening dimensions as persisted by Smplrspace -- always centimeters
 * at this serialization boundary, regardless of the meters used inside
 * this application's own domain model (see SmplrspaceUnits.ts).
 */
export interface SmplrspaceOpeningDimensions {
  readonly width: number;
  readonly height: number;
  readonly baseHeight: number;
}

/**
 * Opening-specific options. Fields beyond what's been observed are
 * intentionally left unmodelled; the index signature keeps the type
 * open to additional persisted keys without resorting to `any`.
 */
export interface SmplrspaceOpeningOptions {
  readonly [key: string]: unknown;
}

export interface SmplrspaceOpening {
  readonly id: string;
  readonly name: string;
  readonly type: SmplrspaceOpeningType;
  readonly layers: readonly string[];
  readonly position: SmplrspaceOpeningPosition;
  readonly dimensions: SmplrspaceOpeningDimensions;
  readonly options?: SmplrspaceOpeningOptions;
}
