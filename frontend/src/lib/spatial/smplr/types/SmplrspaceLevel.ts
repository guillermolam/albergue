import type { SmplrspaceWall } from './SmplrspaceWall';

export interface SmplrspaceLevel {
  readonly name: string;
  /** Roof persisted schema is not yet known -- kept opaque rather than
   * guessed until an observed sample is available. */
  readonly roofs: readonly unknown[];
  readonly walls: readonly SmplrspaceWall[];
}
