/**
 * Swup Configuration with All Plugins
 * Mind-blowing page transitions for Albergue
 */

import type { SwupOptions } from '@swup/core';

// Plugin types (these are loaded from CDN or local)
declare global {
  interface Window {
    SwupAccessibilityPlugin: any;
    SwupBodyClassPlugin: any;
    SwupDebugPlugin: any;
    SwupFormsPlugin: any;
    SwupFragmentPlugin: any;
    SwupHeadPlugin: any;
    SwupJsPlugin: any;
    SwupParallelPlugin: any;
    SwupPreloadPlugin: any;
    SwupProgressBarPlugin: any;
    SwupRouteNamePlugin: any;
    SwupScriptsPlugin: any;
    SwupScrollPlugin: any;
  }
}

/**
 * Load Swup plugins from CDN
 * These will be loaded dynamically when swup initializes
 */
export function loadSwupPlugins() {
  if (typeof window === 'undefined') return Promise.resolve();

  const plugins = [
    // Core plugins
    'https://unpkg.com/@swup/accessibility-plugin@1/dist/SwupAccessibilityPlugin.min.js',
    'https://unpkg.com/@swup/body-class-plugin@1/dist/SwupBodyClassPlugin.min.js',
    'https://unpkg.com/@swup/debug-plugin@1/dist/SwupDebugPlugin.min.js',
    
    // Navigation plugins
    'https://unpkg.com/@swup/forms-plugin@1/dist/SwupFormsPlugin.min.js',
    'https://unpkg.com/@swup/fragment-plugin@1/dist/SwupFragmentPlugin.min.js',
    
    // Content plugins
    'https://unpkg.com/@swup/head-plugin@1/dist/SwupHeadPlugin.min.js',
    'https://unpkg.com/@swup/js-plugin@1/dist/SwupJsPlugin.min.js',
    
    // Performance plugins
    'https://unpkg.com/@swup/parallel-plugin@1/dist/SwupParallelPlugin.min.js',
    'https://unpkg.com/@swup/preload-plugin@1/dist/SwupPreloadPlugin.min.js',
    
    // UI plugins
    'https://unpkg.com/@swup/progress-bar-plugin@1/dist/SwupProgressBarPlugin.min.js',
    'https://unpkg.com/@swup/route-name-plugin@1/dist/SwupRouteNamePlugin.min.js',
    'https://unpkg.com/@swup/scripts-plugin@1/dist/SwupScriptsPlugin.min.js',
    'https://unpkg.com/@swup/scroll-plugin@1/dist/SwupScrollPlugin.min.js',
  ];

  return Promise.all(
    plugins.map(pluginUrl => 
      import(/* @vite-ignore */ pluginUrl)
        .then(module => module.default || module)
        .catch(error => {
          console.warn(`Failed to load plugin: ${pluginUrl}`, error);
          return null;
        })
    )
  );
}

/**
 * Swup Configuration Options
 */
export const swupOptions: SwupOptions = {
  // Animation settings
  animationSelector: '[class*="transition-"]',
  
  // Cache settings
  cache: true,
  
  // Link selector (what links trigger swup)
  linkSelector: 'a[href]:not([data-no-swup]):not([target="_blank"]):not([download])',
  
  // Container settings
  containers: ['#swup'],
  
  // Navigation options
  skipPopStateHandling: false,
  animateHistoryBrowsing: true,
  
  // Scroll restoration
  restoreScroll: true,
  
  // Class names
  classPrefix: 'is-',
  
  // Call to action for better SEO
  updateBrowserURL: true,
};

/**
 * Initialize Swup with all plugins
 * This is called client-side
 */
export async function initSwup() {
  if (typeof window === 'undefined') return;
  
  // Import swup
  const { default: Swup } = await import('@swup/core');
  
  // Load all plugins
  const pluginModules = await loadSwupPlugins();
  const plugins = pluginModules.filter(Boolean);
  
  // Initialize swup with options
  const swup = new Swup(swupOptions);
  
  // Register all plugins
  plugins.forEach(plugin => {
    try {
      swup.use(plugin());
    } catch (error) {
      console.warn('Failed to register plugin:', error);
    }
  });
  
  // Additional customization
  swup.on('click:link', ({ el }) => {
    // Add loading state
    el.classList.add('loading');
  });
  
  swup.on('transition:start', ({ el }) => {
    // Track page transitions
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_transition', {
        from: document.location.pathname,
        to: el.url.pathname,
      });
    }
  });
  
  // Store swup instance on window for debugging
  (window as any).swup = swup;
  
  return swup;
}

/**
 * Swup Plugin for Astro Integration
 * This wraps the initialization for use with @swup/astro
 */
export function createSwupPlugin() {
  return {
    name: 'SwupPlugin',
    hooks: {
      'astro:build:done': async () => {
        // This runs after build
        if (typeof window !== 'undefined') {
          await initSwup();
        }
      },
    },
  };
}
