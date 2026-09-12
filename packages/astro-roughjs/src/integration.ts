import type { AstroIntegration } from 'astro';

/**
 * Astro integration for roughjs that provides a Vite alias and optimizes dependencies.
 */
export function roughjsIntegration(): AstroIntegration {
  return {
    name: '@astrojs/roughjs',
    hooks: {
      'vite:extendConfig': (viteConfig) => {
        // Provide alias for roughjs
        viteConfig.resolve = viteConfig.resolve || {};
        viteConfig.resolve.alias = {
          ...viteConfig.resolve.alias,
          roughjs: 'roughjs/bundled/rough.esm.js',
        };

        // Optimize deps for roughjs
        viteConfig.optimizeDeps = viteConfig.optimizeDeps || {};
        viteConfig.optimizeDeps.include = [
          ...(viteConfig.optimizeDeps.include || []),
          'roughjs',
        ];

        // Set ssr.noExternal for roughjs if needed (since roughjs may not be SSR-safe)
        viteConfig.ssr = viteConfig.ssr || {};
        viteConfig.ssr.noExternal = [
          ...(viteConfig.ssr.noExternal || []),
          'roughjs',
        ];
      },
    },
  };
}
