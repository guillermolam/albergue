/**
 * Air quality config boundary (OpenWeatherMap Air Pollution API).
 *
 * AEMET does not publish air quality data -- this is a deliberately
 * separate provider/key. Nothing is configured yet; no key exists for
 * this project.
 */

/** El Carrascalejo, near Mérida, Extremadura -- same coordinates already
 * used as HOSTEL_CENTER in AreaVisitPage.tsx / AreaEatPage.tsx. */
export const HOSTEL_COORDS = { lat: 39.0223673, lon: -6.3371905 } as const;

export interface AirQualityConfig {
  apiKey: string;
}

/** Fail closed: null unless a key is configured. */
export function getAirQualityConfig(
  env: NodeJS.ProcessEnv = process.env,
): AirQualityConfig | null {
  const { AIR_QUALITY_API_KEY } = env;
  if (!AIR_QUALITY_API_KEY) {
    return null;
  }
  return { apiKey: AIR_QUALITY_API_KEY };
}
