import unocss from '@unocss/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import swup from '@swup/astro';
import icon from 'astro-icon';
import { envField } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sharedConfig = {
  output: 'server',
  // ASTRO-001: validated env schema. Client vars are inlined at build time;
  // server secrets are read via `astro:env/server` and never shipped.
  env: {
    schema: {
      PUBLIC_APP_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_API_MODE: envField.enum({
        context: 'client',
        access: 'public',
        values: ['local', 'mock'],
        default: 'local',
      }),
      BACKEND_API_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // Matches backend/src/lib/middleware.ts's resolveIdentity(): the only
      // credential its admin-gated routes accept until session/OIDC
      // verification lands. Never sent to the client — only used server-side
      // when an already-authenticated Astro admin session calls those routes.
      ADMIN_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    swup({
      theme: 'fade',
      animationClass: 'transition-',
      containers: ['#main-content'],
      cache: true,
      preload: {
        hover: true,
        visible: true,
      },
      accessibility: true,
      forms: true,
      progress: true,
      smoothScrolling: true,
      updateBodyClass: true,
      updateHead: true,
      reloadScripts: true,
      debug: process.env.NODE_ENV !== 'production',
      loadOnIdle: true,
      globalInstance: true,
    }),
    icon({
      include: {
        logos: ['astro', 'unocss', 'threejs', 'animejs'],
        uil: ['football', 'heart'],
        ph: ['footprints-duotone'],
      },
    }),
  ],
  site: process.env.PUBLIC_APP_URL || 'https://albergue-carrascalejo.com',
  base: '/',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      target: 'es2022',
      minify: 'esbuild',
      cssMinify: true,
    },
    server: {
      host: true,
      port: 4321,
      open: false,
      watch: {
        usePolling: false,
        interval: 1000,
      },
    },
    resolve: {
      alias: {
        '@': '/src',
        '@/components': '/src/components',
        '@/layouts': '/src/layouts',
        '@/pages': '/src/pages',
        '@/styles': '/src/styles',
        '@/assets': '/src/assets',
        '@/public': '/public',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    ssr: {
      noExternal: ['@unocss/vite', 'unocss'],
    },
    plugins: [
      tailwindcss(),
      unocss({
        configFile: fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
        mode: 'global',
        injectReset: true,
      }),
    ],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  compressHTML: true,
};
