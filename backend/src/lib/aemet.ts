/**
 * AEMET (Agencia Estatal de Meteorología) config boundary.
 *
 * Nothing is configured yet -- no AEMET API key or INE municipality code
 * exists for this project. AEMET's forecast endpoint is municipality-code
 * based, not lat/lon, and the code must be looked up manually (AEMET's own
 * published municipality listing); it is not something to guess.
 */

export interface AemetConfig {
  apiKey: string;
  /** INE 5-digit municipality code for El Carrascalejo. */
  municipioCode: string;
}

/** Fail closed: null unless every required variable is configured. */
export function getAemetConfig(
  env: NodeJS.ProcessEnv = process.env,
): AemetConfig | null {
  const { AEMET_API_KEY, AEMET_MUNICIPIO_CODE } = env;
  if (!AEMET_API_KEY || !AEMET_MUNICIPIO_CODE) {
    return null;
  }
  return { apiKey: AEMET_API_KEY, municipioCode: AEMET_MUNICIPIO_CODE };
}
