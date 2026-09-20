import type { SmplrspacePoint } from './types/SmplrspacePoint';
import type { SmplrspaceOpeningDimensions } from './types/SmplrspaceOpening';
import type { SmplrspaceDefinition } from './types/SmplrspaceDefinition';
import { assertFiniteNumber, metersToCentimeters } from './SmplrspaceUnits';

/** An application-side point, in meters, prior to serialization. The id
 * is optional: a caller that omits it relies on the injected
 * `IdGenerator` (see SmplrspaceSerializer below). */
export interface SourcePoint {
  readonly id?: string;
  readonly r: number;
  readonly t: number;
}

/** Application-side opening dimensions, in meters, prior to
 * serialization. Distinct from SmplrspaceOpeningDimensions, which is
 * always centimeters (see SmplrspaceUnits.ts). */
export interface SourceOpeningDimensions {
  readonly widthMeters: number;
  readonly heightMeters: number;
  readonly baseHeightMeters: number;
}

export type SmplrspaceIdGenerator = () => string;

/**
 * Translates this application's meters-based domain measurements into
 * the persisted Smplrspace representation. Performs no network calls
 * and holds no connection state -- see SmplrspaceClient for the future
 * remote transport boundary.
 *
 * IDs are never invented silently: a point missing an id is only ever
 * assigned one if an `SmplrspaceIdGenerator` was explicitly injected at
 * construction time. Without one, a missing id is a thrown error.
 */
export class SmplrspaceSerializer {
  constructor(private readonly generateId?: SmplrspaceIdGenerator) {}

  serializePoint(point: SourcePoint): SmplrspacePoint {
    return {
      id: point.id ?? this.nextId(),
      r: assertFiniteNumber(point.r, 'point.r'),
      t: assertFiniteNumber(point.t, 'point.t'),
    };
  }

  serializeOpeningDimensions(dimensions: SourceOpeningDimensions): SmplrspaceOpeningDimensions {
    return {
      width: metersToCentimeters(dimensions.widthMeters),
      height: metersToCentimeters(dimensions.heightMeters),
      baseHeight: metersToCentimeters(dimensions.baseHeightMeters),
    };
  }

  /**
   * Phase 1 has no separate canonical-domain definition shape to
   * translate from -- SmplrspaceDefinition already IS the persisted
   * shape (built up via SmplrspaceDefinitionWriter). This is therefore
   * an identity passthrough, kept as an explicit method so call sites
   * depend on the serialization boundary rather than assuming a
   * definition never needs translating.
   */
  serializeDefinition(definition: SmplrspaceDefinition): SmplrspaceDefinition {
    return definition;
  }

  toJSON(definition: SmplrspaceDefinition): string {
    return JSON.stringify(this.serializeDefinition(definition));
  }

  private nextId(): string {
    if (!this.generateId) {
      throw new Error(
        'SmplrspaceSerializer: point is missing an id and no SmplrspaceIdGenerator was injected.'
      );
    }
    return this.generateId();
  }
}
