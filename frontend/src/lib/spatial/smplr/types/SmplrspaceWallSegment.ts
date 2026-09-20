import type { SmplrspacePoint } from './SmplrspacePoint';
import type { SmplrspaceOpening } from './SmplrspaceOpening';

export interface SmplrspaceWallSegment {
  readonly id: string;
  readonly start: SmplrspacePoint;
  readonly end: SmplrspacePoint;
  readonly openings: readonly SmplrspaceOpening[];
}
