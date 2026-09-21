import unocss from '@unocss/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import swup from '@swup/astro';
import icon from 'astro-icon';
import { envField } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadRootEnv } from './scripts/root-env.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Smplrspace org/token/space ids live once, in the monorepo-root .env.
// Must run before the env schema below is evaluated.
loadRootEnv();

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
      // Smplrspace spatial/floor-plan viewer (see frontend/react/spatial/).
      // Not set directly here or in frontend/.env -- scripts/root-env.mjs
      // resolves them (env var > monorepo-root .env > committed B01
      // default, in that priority order -- see that file for why B01
      // specifically has a real committed default, unlike the other
      // Smplrspace vars) and validates the result, throwing a build error
      // for a malformed value rather than silently degrading. Still
      // `optional: true` here at the schema level only because B02/B03
      // have no committed default yet (no real Smplrspace project exists
      // for either) and are meant to render their "not yet configured"
      // placeholder until they do. Never fall back to Smplrspace's own
      // demo IDs.
      PUBLIC_SMPLR_ORGANIZATION_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_SMPLR_CLIENT_TOKEN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_SMPLR_SPACE_B01_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_SMPLR_SPACE_B02_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_SMPLR_SPACE_B03_ID: envField.string({
        context: 'client',
        access: 'public',
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
  // /info's old content is now split across /hostel/info, /hostel/facilities
  // and /hostel/services -- redirect rather than leave a dead/duplicate page.
  redirects: {
    '/info': '/hostel/info',
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
      // Vite's 500kB default flags three-core.js (~730kB) and maplibre.js
      // (~1MB): the actual, unavoidable weight of the WebGL engines
      // HostelScene's <Canvas> and MapLibreMap require from Three.js and
      // MapLibre GL JS themselves -- confirmed by isolating each into its
      // own chunk (below) and finding none shrinks further without
      // dropping 3D/map rendering. Not a stand-in for fixing bloat.
      chunkSizeWarningLimit: 1100,
      rolldownOptions: {
        output: {
          // three/@react-three/* (HostelScene's client:only island) are the
          // only reason any single output chunk exceeds 500kB. Splitting
          // them into their own chunk doesn't shrink that inherent weight,
          // but keeps it isolated from -- and shared cacheably across --
          // whichever future pages end up rendering that island, instead of
          // one page's build accidentally inflating an unrelated chunk.
          manualChunks(id) {
            if (/node_modules\/@react-three\/drei\//.test(id)) return 'three-drei';
            if (/node_modules\/@react-three\/fiber\//.test(id)) return 'three-fiber';
            if (/node_modules\/three\//.test(id)) return 'three-core';
            // maplibre-gl is only pulled in via client:only on the Area/Contact
            // map pages -- isolate it so it doesn't inflate an unrelated chunk.
            if (/node_modules\/maplibre-gl\//.test(id)) return 'maplibre';
            // gsap is used across most of the new Hostel/Area pages -- one
            // shared, cacheable chunk rather than duplicated per page.
            if (/node_modules\/gsap\//.test(id)) return 'gsap';
            return undefined;
          },
        },
      },
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
