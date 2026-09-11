import { getStormkitApiKey } from './stormkit-env.mjs';

const apiKey = await getStormkitApiKey();
if (!apiKey) {
  throw new Error(
    'STORMKIT_ALBERGUE_KEY is required to query Stormkit (legacy STROMKIT_ALBERGUE_KEY also accepted).'
  );
}
const envId = process.env.STORMKIT_ENV_ID;
if (!envId) {
  throw new Error(
    'STORMKIT_ENV_ID is required because STORMKIT_ALBERGUE_KEY is not environment-scoped.'
  );
}

const url = new URL('https://api.stormkit.io/v1/deployments');
url.searchParams.set('limit', '1');
url.searchParams.set('envId', envId);
const response = await fetch(url, {
  headers: { Authorization: apiKey },
});
const body = await response.text();
let result;
try {
  result = JSON.parse(body);
} catch {
  result = { message: body };
}

if (!response.ok) {
  throw new Error(
    `Stormkit API returned ${response.status}: ${result.message || result.error || 'Request failed'}`
  );
}

const deployments = Array.isArray(result) ? result : result.deployments || result.data || [];
console.log(
  `Stormkit authentication succeeded. Returned ${deployments.length} deployment record(s).`
);
