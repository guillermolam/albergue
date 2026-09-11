import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import { sharedConfig } from './astro.config.shared.mjs';

export default defineConfig({
  ...sharedConfig,
  adapter: node({
    mode: 'standalone',
  }),
});