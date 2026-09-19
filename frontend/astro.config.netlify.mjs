import netlify from '@astrojs/netlify';
import { defineConfig } from 'astro/config';
import { sharedConfig } from './astro.config.shared.mjs';

export default defineConfig({
  ...sharedConfig,
  adapter: netlify({
    staticHeaders: true,
  }),
});
