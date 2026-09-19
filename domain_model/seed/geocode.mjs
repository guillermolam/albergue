#!/usr/bin/env node
/**
 * Small Nominatim (OpenStreetMap) geocoding helper, for correcting/looking
 * up real coordinates when writing seed data. Not part of the app runtime
 * -- run manually, ad hoc, when seed content needs a real address checked.
 *
 * Respects Nominatim's usage policy (https://operations.osmfoundation.org/
 * policies/nominatim/): a descriptive User-Agent identifying the app, and
 * no more than 1 request/second.
 *
 * Usage: node geocode.mjs "El Carrascalejo, Badajoz, España"
 */

const USER_AGENT = 'AlbergueCarrascalejoSeedTooling/1.0 (contact: info@alberguecarrascalejo.com)';

async function geocode(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '3');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Nominatim request failed: ${res.status}`);
  return res.json();
}

const query = process.argv.slice(2).join(' ');
if (!query) {
  console.error('Usage: node geocode.mjs "<address to geocode>"');
  process.exit(1);
}

const results = await geocode(query);
if (results.length === 0) {
  console.log(`No match for "${query}".`);
} else {
  for (const r of results) {
    console.log(`${r.display_name}\n  lat=${r.lat} lon=${r.lon} type=${r.addresstype ?? r.type}`);
  }
}
