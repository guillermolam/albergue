/**
 * El Carrascalejo air quality (OpenWeatherMap Air Pollution API proxy).
 *
 * No AIR_QUALITY_API_KEY is configured for this project yet --
 * getAirQualityConfig() returns null until it's set as a Worker secret,
 * in which case this responds success with `data: null` rather than an
 * error, matching carrascalejo_weather.ts's "not configured yet" state.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import type { ApiResponse } from "../types/index.js";
import { BROWSER_USER_AGENT, TimedCache } from "../lib/external_feed.js";
import { getAirQualityConfig, HOSTEL_COORDS } from "../lib/air_quality.js";

export interface AirQuality {
  /** OpenWeatherMap's own scale: 1 Good, 2 Fair, 3 Moderate, 4 Poor, 5 Very Poor. */
  aqi: 1 | 2 | 3 | 4 | 5;
  /** Highest-concentration pollutant among the ones OpenWeatherMap reports
   * -- a simple "what to point at" heuristic for a small badge, not a
   * health-threshold calculation. */
  dominantPollutant: string;
}

const OPENWEATHERMAP_BASE = "https://api.openweathermap.org/data/2.5/air_pollution";

interface OpenWeatherMapAirPollutionRaw {
  list: {
    main: { aqi: 1 | 2 | 3 | 4 | 5 };
    components: Record<string, number>;
  }[];
}

async function fetchAirQuality(apiKey: string): Promise<AirQuality> {
  const url = `${OPENWEATHERMAP_BASE}?lat=${HOSTEL_COORDS.lat}&lon=${HOSTEL_COORDS.lon}&appid=${apiKey}`;
  const response = await fetch(url, { headers: { "User-Agent": BROWSER_USER_AGENT } });
  if (!response.ok) {
    throw new Error(`OpenWeatherMap air pollution API responded ${response.status}`);
  }
  const body = (await response.json()) as OpenWeatherMapAirPollutionRaw;
  const entry = body.list[0];
  if (!entry) {
    throw new Error("OpenWeatherMap air pollution API returned no data");
  }

  // reduce() needs an explicit initial value -- entry.components could in
  // principle be empty, and without one that throws rather than degrading.
  const [dominantPollutant] = Object.entries(entry.components).reduce<[string, number]>(
    (max, current) => (current[1] > max[1] ? current : max),
    ["", -Infinity],
  );

  return { aqi: entry.main.aqi, dominantPollutant };
}

const cache = new TimedCache<AirQuality>(60 * 60 * 1000);

const airQuality = new Hono();

airQuality.get("/", async (c: Context) => {
  const config = getAirQualityConfig();
  if (!config) {
    return c.json<ApiResponse<AirQuality | null>>({
      success: true,
      data: null,
      message: "Air quality source not configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const data = await cache.get(() => fetchAirQuality(config.apiKey));
    return c.json<ApiResponse<AirQuality>>({
      success: true,
      data,
      message: "Air quality retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(502, { message: `Failed to fetch air quality: ${String(error)}` });
  }
});

export default airQuality;
