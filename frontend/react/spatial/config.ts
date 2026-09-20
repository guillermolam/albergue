import {
  PUBLIC_SMPLR_ORGANIZATION_ID,
  PUBLIC_SMPLR_CLIENT_TOKEN,
  PUBLIC_SMPLR_SPACE_B01_ID,
  PUBLIC_SMPLR_SPACE_B02_ID,
  PUBLIC_SMPLR_SPACE_B03_ID,
} from 'astro:env/client';
import type { BuildingCode } from './domain/types';

const SPACE_ID_BY_BUILDING: Record<BuildingCode, string | undefined> = {
  B01: PUBLIC_SMPLR_SPACE_B01_ID,
  B02: PUBLIC_SMPLR_SPACE_B02_ID,
  B03: PUBLIC_SMPLR_SPACE_B03_ID,
};

export interface SmplrBuildingConfig {
  spaceId: string;
  clientToken: string;
  organizationId: string;
}

/** Null until a real Smplrspace organization/clientToken and this
 * building's Space id all exist -- never falls back to Smplrspace's own
 * demo credentials. */
export function getSmplrConfig(building: BuildingCode): SmplrBuildingConfig | null {
  const spaceId = SPACE_ID_BY_BUILDING[building];
  if (!spaceId || !PUBLIC_SMPLR_CLIENT_TOKEN || !PUBLIC_SMPLR_ORGANIZATION_ID) {
    return null;
  }
  return {
    spaceId,
    clientToken: PUBLIC_SMPLR_CLIENT_TOKEN,
    organizationId: PUBLIC_SMPLR_ORGANIZATION_ID,
  };
}

export function isSmplrConfigured(building: BuildingCode): boolean {
  return getSmplrConfig(building) !== null;
}
