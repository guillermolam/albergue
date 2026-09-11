import {
  defineConfig,
  presetTypography,
  presetUno,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [
        './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}',
        './src/**/*.css',
      ],
    },
    extract: {
      include: [
        './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}',
        './src/**/*.css',
      ],
    },
  },
  presets: [
    presetUno(),
    presetTypography(),
  ],
  theme: {
    colors: {
      primary: '#00AB39',
      white: '#FFFFFF',
      black: '#000000',
      yellow: '#EAC102',
      red: '#ED1C24',
      blue: '#0071BC',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      stone: {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
      },
      brand: {
        green: '#00AB39',
        greendark: '#008a2e',
        greenlight: '#33c161',
        blue: '#0071BC',
        yellow: '#EAC102',
        red: '#ED1C24',
        ink: '#111111',
      },
      accent: {
        green: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
        },
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
        },
      },
    },
  },
  shortcuts: [
    // Custom button styles
    ['btn', 'px-4 py-2 rounded-lg font-medium transition-colors'],
    ['btn-primary', 'btn bg-brand-green text-white hover:bg-brand-greendark'],
    ['btn-secondary', 'btn bg-brand-yellow text-brand-red'],
    ['btn-outline', 'btn border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white'],
    ['btn-circle', 'btn rounded-full aspect-square p-2'],
    ['btn-square', 'btn aspect-square p-2'],
    ['btn-sm', 'btn px-3 py-1.5 text-sm'],
    ['btn-ghost', 'btn text-brand-green hover:bg-brand-green/10'],
    
    // Badge styles (replacing DaisyUI)
    ['badge', 'px-3 py-1 rounded-full text-sm font-medium'],
    ['badge-sm', 'px-2 py-0.5 rounded-full text-xs font-medium'],
    ['badge-success', 'badge bg-accent-green-100 text-accent-green-800'],
    ['badge-error', 'badge bg-accent-red-100 text-accent-red-800'],
    ['badge-warning', 'badge bg-accent-yellow-100 text-accent-yellow-800'],
    ['badge-blue', 'badge bg-accent-blue-100 text-accent-blue-800'],
    
    // Card styles
    ['card', 'bg-white rounded-xl shadow-sm border border-stone-200'],
    ['card-title', 'text-xl font-bold mb-2'],
    ['card-brut', 'border-4 border-black bg-white shadow-[8px_8px_0_0_#000] rounded-none p-4'],
    ['rounded-box', 'rounded-xl'],
    
    // DaisyUI stat component replacements
    ['stat', 'bg-stone-50 rounded-xl p-6'],
    ['stat-figure', 'text-brand-green'],
    ['stat-title', 'text-sm text-slate-600'],
    ['stat-value', 'text-3xl font-bold text-brand-green'],
    ['stat-desc', 'text-xs text-slate-500'],
    
    // Hero component
    ['hero', 'min-h-[60vh] flex items-center justify-center'],
    ['hero-content', 'text-center max-w-2xl'],
    
    // Custom doodle styles
    ['ds-card', 'bg-white ring-1 ring-stone-200 shadow-sm rounded-3xl'],
    ['ds-muted', 'text-stone-600'],
    [
      'ds-btn',
      'inline-flex items-center justify-center font-900 rounded-2xl px-6 py-3 transition select-none',
    ],
    ['ds-btn-primary', 'ds-btn bg-brand-green text-white'],
    ['ds-btn-outline', 'ds-btn bg-white text-stone-900 border-2 border-stone-300'],
    
    // Booking status classes
    ['booking-details', 'space-y-4'],
    ['booking-status', 'badge'],
  ],
  safelist: [
    // Custom animation classes
    'animate-bounce-3d',
    'animate-float-3d',
    'animate-morph-path',
    'animate-neon-pulse',
    'animate-on-scroll',
    'animate-on-scroll-left',
    'animate-on-scroll-right',
    'animate-on-scroll-scale',
    'animate-on-scroll-rotate',
    'animate-particle',
    'animate-rotating-gradient',
    'animate-shimmer',
    'animate-typewriter',
    'animate-float',
    
    // Custom hover effects
    'hover-3d',
    'hover-glow',
    'hover-liquid',
    'hover-morph',
    
    // Custom utility classes
    'magic-border',
    'doodle-border',
    'doodle-shadow',
    'hand-drawn',
    'highlight-doodle',
    'paper-texture',
    'sketch-title',
    'sketch-underline',
    'arrow-doodle',
    'parallax-layer',
    'particle-network',
    'scrollbar-hide',
    'no-print',
    
    // Brand colors
    'bg-brand-green',
    'bg-brand-blue',
    'bg-brand-yellow',
    'bg-brand-red',
    'text-brand-green',
    'text-brand-blue',
    'text-brand-yellow',
    'text-brand-red',
    'border-brand-green',
    'border-brand-blue',
    
    // Custom shortcuts from components
    'card-brut',
    'btn',
    'btn-primary',
    'btn-secondary',
    'badge-doodle',
    'ds-card',
    'ds-muted',
    'ds-btn',
    'ds-btn-primary',
    'ds-btn-outline',
  ],
  transformers: [transformerVariantGroup()],
});
