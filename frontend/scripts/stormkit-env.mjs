import { readFile } from 'node:fs/promises';

export async function getStormkitApiKey() {
  if (process.env.STROMKIT_ALBERGUE_KEY) return process.env.STROMKIT_ALBERGUE_KEY;

  try {
    const envFile = await readFile(new URL('../../.env', import.meta.url), 'utf8');
    const line = envFile.split(/\r?\n/).find((entry) => entry.startsWith('STROMKIT_ALBERGUE_KEY='));
    return line?.slice(line.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  } catch {
    return undefined;
  }
}