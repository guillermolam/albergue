import { defineConfig } from 'astro/config';
import { sharedConfig } from './astro.config.shared.mjs';

export default defineConfig({
  ...sharedConfig,
  server: {
    port: process.env.PORT || 4321,
    host: true,
  },
});
