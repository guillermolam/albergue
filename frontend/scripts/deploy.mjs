import { execFileSync, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { getStormkitApiKey } from './stormkit-env.mjs';

const providers = ['cloudflare', 'netlify', 'stormkit'];
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

async function deployToStormkit() {
  const apiKey = await getStormkitApiKey();
  if (!apiKey) {
    throw new Error(
      'STORMKIT_ALBERGUE_KEY is required to deploy with the Stormkit API (legacy STROMKIT_ALBERGUE_KEY also accepted).'
    );
  }

  const branch =
    process.env.STORMKIT_BRANCH ||
    execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
  if (!branch)
    throw new Error('Stormkit deployment requires STORMKIT_BRANCH or a named Git branch.');

  const body = {
    branch,
    publish: process.env.STORMKIT_PUBLISH !== '0',
    ...(process.env.STORMKIT_ENV_ID ? { envId: process.env.STORMKIT_ENV_ID } : {}),
  };
  if (dryRun) {
    stdout.write(
      `Stormkit dry run: branch=${branch}, publish=${body.publish}, envId=${body.envId || 'environment-scoped-key'}\n`
    );
    return;
  }
  const response = await fetch('https://api.stormkit.io/v1/deploy', {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const responseBody = await response.text();
  let result;
  try {
    result = JSON.parse(responseBody);
  } catch {
    result = { message: responseBody };
  }
  if (!response.ok) {
    throw new Error(
      `Stormkit API returned ${response.status}: ${result.message || result.error || 'Deployment failed'}`
    );
  }

  stdout.write(`Stormkit deployment ${result.id} created for branch ${result.branch || branch}.\n`);
}

async function chooseProvider() {
  if (!stdin.isTTY) {
    throw new Error(
      `A deployment provider is required in non-interactive mode: ${providers.join(', ')}`
    );
  }

  const prompt = createInterface({ input: stdin, output: stdout });
  const answer = await prompt.question(
    `Choose a deployment provider:\n${providers.map((provider, index) => `  ${index + 1}. ${provider}`).join('\n')}\nProvider: `
  );
  prompt.close();
  return providers[Number(answer) - 1] ?? answer.trim().toLowerCase();
}

const requestedProvider =
  args.find((argument) => argument !== '--' && argument !== '--dry-run') ??
  process.env.DEPLOY_TARGET;
const provider = requestedProvider || (await chooseProvider());

if (!providers.includes(provider)) {
  throw new Error(`Unsupported deployment provider "${provider}". Choose: ${providers.join(', ')}`);
}

if (provider === 'cloudflare') {
  run('pnpm', ['run', dryRun ? 'deploy:cloudflare:dry-run' : 'deploy:cloudflare']);
} else if (provider === 'netlify') {
  run('pnpm', ['run', dryRun ? 'build:netlify' : 'deploy:netlify']);
} else {
  run('pnpm', ['run', 'build:stormkit']);
  if (process.exitCode) process.exit(process.exitCode);
  await deployToStormkit();
}
