import type { BuildingCode } from './types';

/** Human-readable building names. B02/B03 dimensions and room lists are
 * reconstruction inputs (photos, sketches, aerial imagery, and for B03 a
 * measured ~67.50m perimeter) -- not yet verified against traced
 * Smplrspace geometry. Keep only what's needed for UI labels here; do not
 * duplicate room/furniture geometry that belongs in Smplrspace. */
export const BUILDING_LABELS: Record<BuildingCode, { es: string; en: string }> = {
  B01: { es: 'Alojamiento', en: 'Accommodation' },
  B02: { es: 'Zona Social / Bar', en: 'Social / Bar' },
  B03: { es: 'Almacén', en: 'Warehouse' },
};
