import type { SmplrspaceWallSegment } from './SmplrspaceWallSegment';

/**
 * Known wall options observed in the persisted format. `cap` and the
 * nested `type` are categorical/string-like but their full value sets
 * are undocumented, so they're kept as `string` rather than a guessed
 * enum. `autoFacade`/`partOfFacade` read as plain boolean flags. The
 * index signature keeps the type open to additional persisted keys
 * without resorting to `any`.
 */
export interface SmplrspaceWallOptions {
  readonly cap?: string;
  readonly type?: string;
  readonly autoFacade?: boolean;
  readonly partOfFacade?: boolean;
  readonly [key: string]: unknown;
}

export type SmplrspaceWallKind = 'wall';

export interface SmplrspaceWall {
  readonly id: string;
  readonly name: string;
  readonly type: SmplrspaceWallKind;
  readonly layers: readonly string[];
  readonly options?: SmplrspaceWallOptions;
  readonly segments: readonly SmplrspaceWallSegment[];
}
