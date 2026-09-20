/**
 * Spatial domain types.
 *
 * Source-of-truth separation (see docs/adr, once written):
 * - Smplrspace holds physical/spatial truth (walls, room geometry, where a
 *   bunk physically sits).
 * - This app's own database (domain_model/schema.ts's `beds`/`bookings`
 *   tables) holds business/booking truth (price, availability, who's
 *   staying). A `Bed.bedId` here IS that table's real integer id -- this
 *   layer never invents a parallel booking concept, it only adds spatial
 *   metadata on top of what already exists.
 *
 * A physical bunk is ONE spatial object; it represents up to two
 * independently bookable beds (upper/lower). A bottom-only bed (no bunk)
 * is represented as a Bunk with only a 'lower' entry.
 */

/** The three physical buildings on site. Real codes, not display names --
 * see BUILDING_LABELS in ./labels.ts for the human-readable name. */
export type BuildingCode = 'B01' | 'B02' | 'B03';

export interface Building {
  code: BuildingCode;
  /** Smplrspace Space id (spc_...) once the building has been traced in
   * their Editor. Null until then -- see config.ts. */
  smplrSpaceId: string | null;
}

/** How a domain object is located within the traced Smplrspace geometry.
 * Deliberately minimal: we resolve the actual polygon/position live via
 * QueryClient rather than duplicating coordinates here (section 8 of the
 * migration spec) -- a wall moving in Smplrspace must never require a
 * matching edit to this database. */
export type SpatialBinding =
  | { type: 'smplr-furniture'; furnitureId: string }
  | {
      type: 'smplr-room';
      seedPoint: { levelIndex: number; x: number; z: number; elevation?: number };
    }
  | { type: 'unbound' };

export interface Room {
  id: string;
  buildingCode: BuildingCode;
  name: string;
  spatialBinding: SpatialBinding;
}

export type BedLevel = 'lower' | 'upper';

export type BedStatus =
  'available' | 'selected' | 'held' | 'reserved' | 'occupied' | 'blocked' | 'maintenance';

export interface Bed {
  /** The real id from domain_model/schema.ts's `beds` table. */
  bedId: number;
  level: BedLevel;
  status: BedStatus;
}

/** One physical bunk (or single bed, if it only has a 'lower' entry). */
export interface Bunk {
  id: string;
  roomId: string;
  spatialBinding: SpatialBinding;
  beds: Bed[];
}

/** Derived, not stored -- see domain/bunkStatus.ts. */
export type BunkVisualStatus = 'available' | 'limited' | 'unavailable' | 'operational-override';
