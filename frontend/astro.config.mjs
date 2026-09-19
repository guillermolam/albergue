import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import netlify from '@astrojs/netlify';
import vercel from '@astrojs/vercel';
import { markdown } from '@astrojs/markdown-remark';
import { image } from '@astrojs/image';

export default defineConfig({
  output: 'server',

  markdown: {
    toc: true,
    gfm: true,
  },

  integrations: [
    cloudflare(),
    netlify(),
    vercel(),
    markdown(),
    image({
      width: 1024,
      formats: ['auto'],
      output: 'webp',
    }),
  ],

  build: {
    inlineDynamicImports: false,
  },

  server: {
    port: process.env.PORT || 4321,
    host: true,
  },
});
