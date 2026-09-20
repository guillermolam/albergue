/**
 * El Carrascalejo weather forecast (AEMET proxy).
 *
 * AEMET's forecast API is a two-step fetch: the first request (municipality
 * + API key) returns a small envelope containing a `datos` URL, which must
 * be fetched separately for the real forecast payload.
 *
 * No AEMET_API_KEY / AEMET_MUNICIPIO_CODE is configured for this project
 * yet -- getAemetConfig() returns null until both are set as Worker
 * secrets, in which case this responds success with `data: null` rather
 * than an error, since "not configured yet" is an expected, calm state,
 * not a failure.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import type { ApiResponse } from "../types/index.js";
import { BROWSER_USER_AGENT, TimedCache } from "../lib/external_feed.js";
import { getAemetConfig } from "../lib/aemet.js";

export interface DailyForecast {
  date: string;
  /** AEMET's own sky-state code (e.g. "11" clear, "23" cloudy with rain --
   * see AEMET's published code table); the frontend maps this to an icon. */
  skyCode: string;
  tempMax: number;
  tempMin: number;
  /** 0-100. */
  precipProbability: number;
}

export type WeatherForecast = DailyForecast[];

const AEMET_BASE = "https://opendata.aemet.es/opendata/api";

interface AemetEnvelope {
  descripcion: string;
  estado: number;
  datos?: string;
}

interface AemetDailyPeriodRaw {
  fecha: string;
  temperatura?: { maxima?: number; minima?: number };
  estadoCielo?: { value?: string }[];
  probPrecipitacion?: { value?: number }[];
}

interface AemetMunicipioRaw {
  prediccion?: { dia?: AemetDailyPeriodRaw[] };
}

async function fetchWeatherForecast(
  municipioCode: string,
  apiKey: string,
): Promise<WeatherForecast> {
  const envelopeResponse = await fetch(
    `${AEMET_BASE}/prediccion/especifica/municipio/diaria/${municipioCode}`,
    { headers: { "User-Agent": BROWSER_USER_AGENT, api_key: apiKey } },
  );
  if (!envelopeResponse.ok) {
    throw new Error(`AEMET envelope request responded ${envelopeResponse.status}`);
  }
  const envelope = (await envelopeResponse.json()) as AemetEnvelope;
  if (!envelope.datos) {
    throw new Error(`AEMET envelope missing 'datos' URL: ${envelope.descripcion}`);
  }

  const dataResponse = await fetch(envelope.datos, {
    headers: { "User-Agent": BROWSER_USER_AGENT },
  });
  if (!dataResponse.ok) {
    throw new Error(`AEMET data request responded ${dataResponse.status}`);
  }
  const body = (await dataResponse.json()) as AemetMunicipioRaw[];
  const days = body[0]?.prediccion?.dia ?? [];

  return days.slice(0, 3).map((day) => ({
    date: day.fecha,
    skyCode: day.estadoCielo?.[0]?.value ?? "",
    tempMax: day.temperatura?.maxima ?? 0,
    tempMin: day.temperatura?.minima ?? 0,
    precipProbability: day.probPrecipitacion?.[0]?.value ?? 0,
  }));
}

const cache = new TimedCache<WeatherForecast>(60 * 60 * 1000);

const weather = new Hono();

weather.get("/", async (c: Context) => {
  const config = getAemetConfig();
  if (!config) {
    return c.json<ApiResponse<WeatherForecast | null>>({
      success: true,
      data: null,
      message: "AEMET not configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const data = await cache.get(() =>
      fetchWeatherForecast(config.municipioCode, config.apiKey),
    );
    return c.json<ApiResponse<WeatherForecast>>({
      success: true,
      data,
      message: "Weather forecast retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(502, { message: `Failed to fetch weather forecast: ${String(error)}` });
  }
});

export default weather;
