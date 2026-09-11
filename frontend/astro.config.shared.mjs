import unocss from '@unocss/vite';
import swup from '@swup/astro';
import icon from 'astro-icon';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sharedConfig = {
  output: 'server',
  integrations: [
    swup({
      animationSelector: '[class*="transition-"]',
    }),
    icon({
      include: {
        logos: ['astro', 'unocss', 'threejs', 'roughjs', 'animejs'],
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
    optimizeDeps: {
      include: [],
    },
    ssr: {
      noExternal: ['@unocss/vite', 'unocss'],
    },
    plugins: [
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