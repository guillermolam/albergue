/**
 * A point as observed in the Smplrspace saved_definition serialization
 * format. `r`/`t` are the coordinate field names Smplrspace itself
 * persists -- not our application's coordinate naming. Units are
 * whatever Smplrspace's own editor produced; unlike opening dimensions,
 * no documented meters/centimeters convention is known for these, so no
 * conversion is applied to them here (see SmplrspaceUnits.ts).
 */
export interface SmplrspacePoint {
  readonly id: string;
  readonly r: number;
  readonly t: number;
}
