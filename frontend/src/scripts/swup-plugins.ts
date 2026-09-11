/**
 * Swup Plugins Initialization
 * Loads and registers all 13 Swup plugins for mind-blowing animations
 * Uses CDN scripts loaded in Layout.astro head for better performance
 */

// Define plugin types
declare global {
  interface Window {
    Swup: any;
    swup: any;
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

// Plugin configuration
interface PluginConfig {
  name: string;
  cdnUrl: string;
  options?: any;
}

const plugins: PluginConfig[] = [
  {
    name: 'AccessibilityPlugin',
    cdnUrl: 'https://unpkg.com/@swup/accessibility-plugin@1/dist/SwupAccessibilityPlugin.umd.js',
    options: {
      liveRegion: true,
      announceTransitions: true,
    },
  },
  {
    name: 'BodyClassPlugin',
    cdnUrl: 'https://unpkg.com/@swup/body-class-plugin@1/dist/SwupBodyClassPlugin.umd.js',
    options: {
      prefix: 'page-',
      usePath: true,
    },
  },
  {
    name: 'DebugPlugin',
    cdnUrl: 'https://unpkg.com/@swup/debug-plugin@1/dist/SwupDebugPlugin.umd.js',
    options: {
      enabled: import.meta.env.DEV,
      logLevel: 'debug',
    },
  },
  {
    name: 'FormsPlugin',
    cdnUrl: 'https://unpkg.com/@swup/forms-plugin@1/dist/SwupFormsPlugin.umd.js',
    options: {
      serializeFormData: true,
      scrollToTop: true,
    },
  },
  {
    name: 'FragmentPlugin',
    cdnUrl: 'https://unpkg.com/@swup/fragment-plugin@1/dist/SwupFragmentPlugin.umd.js',
    options: {
      selectors: ['[data-fragment]'],
    },
  },
  {
    name: 'HeadPlugin',
    cdnUrl: 'https://unpkg.com/@swup/head-plugin@1/dist/SwupHeadPlugin.umd.js',
    options: {
      mergeHead: true,
      preserveHead: ['meta[charset]', 'meta[name=viewport]', 'title'],
    },
  },
  {
    name: 'JsPlugin',
    cdnUrl: 'https://unpkg.com/@swup/js-plugin@1/dist/SwupJsPlugin.umd.js',
    options: {
      reloadScripts: true,
      ignoreScriptTags: ['script[type="module"]', 'script[src*="analytics"]'],
    },
  },
  {
    name: 'ParallelPlugin',
    cdnUrl: 'https://unpkg.com/@swup/parallel-plugin@1/dist/SwupParallelPlugin.umd.js',
    options: {
      maxParallelRequests: 3,
    },
  },
  {
    name: 'PreloadPlugin',
    cdnUrl: 'https://unpkg.com/@swup/preload-plugin@1/dist/SwupPreloadPlugin.umd.js',
    options: {
      preload: true,
      preloadDelay: 100,
      preloadOnlyVisibleLinks: true,
    },
  },
  {
    name: 'ProgressBarPlugin',
    cdnUrl: 'https://unpkg.com/@swup/progress-bar-plugin@1/dist/SwupProgressBarPlugin.umd.js',
    options: {
      color: '#00AB39',
      height: '4px',
      opacity: 0.8,
      transition: 'opacity 0.3s ease',
    },
  },
  {
    name: 'RouteNamePlugin',
    cdnUrl: 'https://unpkg.com/@swup/route-name-plugin@1/dist/SwupRouteNamePlugin.umd.js',
    options: {
      property: 'data-route-name',
    },
  },
  {
    name: 'ScriptsPlugin',
    cdnUrl: 'https://unpkg.com/@swup/scripts-plugin@1/dist/SwupScriptsPlugin.umd.js',
    options: {
      executeScripts: true,
      executeAsyncScripts: true,
    },
  },
  {
    name: 'ScrollPlugin',
    cdnUrl: 'https://unpkg.com/@swup/scroll-plugin@1/dist/SwupScrollPlugin.umd.js',
    options: {
      restoreScroll: true,
      saveScroll: true,
      animateScroll: true,
    },
  },
];

/**
 * Load a script from CDN dynamically
 */
function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document is not available'));
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Check if a plugin is already loaded on window
 */
function isPluginLoaded(pluginName: string): boolean {
  return typeof (window as any)[`Swup${pluginName}`] !== 'undefined';
}

/**
 * Get a plugin constructor from window
 */
function getPluginConstructor(pluginName: string): any {
  return (window as any)[`Swup${pluginName}`];
}

/**
 * Initialize all Swup plugins
 * Note: @swup/astro already initializes swup, so we just need to register plugins
 */
export async function initializeSwupPlugins() {
  if (typeof window === 'undefined') return;

  // Wait for swup to be initialized by @swup/astro
  let swup = (window as any).swup;
  if (!swup) {
    // If not initialized yet, wait a bit and try again
    await new Promise(resolve => setTimeout(resolve, 100));
    swup = (window as any).swup;
  }

  if (!swup) {
    console.warn('Swup is not initialized. Make sure @swup/astro is configured in your Astro config.');
    return;
  }

  for (const plugin of plugins) {
    try {
      if (isPluginLoaded(plugin.name)) {
        const PluginConstructor = getPluginConstructor(plugin.name);
        const pluginInstance = PluginConstructor(plugin.options);
        swup.use(pluginInstance);
        console.log(`✅ Registered ${plugin.name}`);
        continue;
      }

      await loadScript(plugin.cdnUrl);
      
      if (isPluginLoaded(plugin.name)) {
        const PluginConstructor = getPluginConstructor(plugin.name);
        const pluginInstance = PluginConstructor(plugin.options);
        swup.use(pluginInstance);
        console.log(`✅ Registered ${plugin.name} (from CDN)`);
      } else {
        console.warn(`⚠️ Failed to load ${plugin.name}`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to load ${plugin.name}:`, error);
    }
  }

  (window as any).swup = swup;

  swup.on('click:link', ({ el }: any) => {
    el.classList.add('loading');
    document.body.style.cursor = 'wait';
  });

  swup.on('transition:start', () => {
    document.body.style.cursor = 'wait';
  });

  swup.on('transition:end', () => {
    document.body.style.cursor = '';
    document.querySelectorAll('.loading').forEach(el => {
      el.classList.remove('loading');
    });
  });

  swup.on('content:replaced', () => {
    window.dispatchEvent(new CustomEvent('swup:content:replaced'));
  });

  return swup;
}

if (typeof window !== 'undefined' && !window.swup) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSwupPlugins);
  } else {
    initializeSwupPlugins();
  }
}
