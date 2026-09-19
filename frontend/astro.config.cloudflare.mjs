import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import { sharedConfig } from './astro.config.shared.mjs';

export default defineConfig({
  ...sharedConfig,
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
});
