import { defineConfig, presetTypography, presetWind3, transformerVariantGroup } from 'unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: ['./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}'],
      // Components ported from figma/ are styled with Tailwind v4 + the
      // shadcn theme (src/styles/shadcn-theme.css), not UnoCSS's presetWind3.
      // With mode: 'global', UnoCSS scans every matching file regardless of
      // page-level imports — leaving these in scope meant it generated its
      // own (different) CSS for the same class names Tailwind emits
      // (flex, border, rounded-lg, bg-primary, ...), and cascade order
      // between the two engines' stylesheets decided which one won, which
      // broke the shadcn design's actual appearance.
      //
      // Scoped to *.tsx only (not **) — src/components/ui/ and
      // src/components/admin/ also hold pre-existing *.astro components
      // (Button.astro, Stat.astro, ...) that legitimately use UnoCSS's own
      // btn/stat shortcuts and must stay in scope.
      exclude: ['./src/components/ui/*.tsx', './src/components/admin/*.tsx'],
    },
  },
  presets: [presetWind3(), presetTypography()],
  theme: {
    // Design System Tokens mapped to CSS variables
    colors: {
      'green-light': 'var(--green-light)',
      'green-medium': 'var(--green-medium)',
      'green-dark': 'var(--green-dark)',
      'green-darker': 'var(--green-darker)',
      cream: 'var(--cream)',
      'light-grey': 'var(--light-grey)',
      'medium-grey': 'var(--medium-grey)',
      'dark-grey': 'var(--dark-grey)',
      charcoal: 'var(--charcoal)',
      'paper-bg': 'var(--paper-bg)',
      'status-success': 'var(--status-success)',
      'status-warning': 'var(--status-warning)',
      'status-error': 'var(--status-error)',
      'status-info': 'var(--status-info)',
      // Brand colors + prototype variants
      'brand-green': '#00AB39',
      'brand-blue': '#0071BC',
      'brand-blue-dark': '#005a94',
      'brand-blue-darker': '#003d66',
      'brand-blue-light': '#E3F2FD',
      'brand-blue-bright': '#2196F3',
      'brand-red': '#ED1C24',
      'brand-red-light': '#FFE8E8',
      'brand-red-soft': '#EF9A9A',
      'brand-red-dark': '#C62828',
      'brand-yellow': '#EAC102',
      'brand-yellow-light': '#FFF9E6',
      'brand-yellow-bright': '#FFD700',
      'brand-yellow-dark': '#D4A017',
      terracotta: '#D4A574',
      'sketch-brown': '#5D4E37',
      olive: '#8B956D',
      'warm-beige': '#F5E6D3',
    },
    borderWidth: {
      '3': '3px',
      '5': '5px',
      '6': '6px',
    },
    fontFamily: {
      handwritten: 'var(--font-handwritten)',
      sketch: 'var(--font-sketch)',
      accent: 'var(--font-accent)',
      mono: 'var(--font-mono)',
    },
    boxShadow: {
      doodle: 'var(--doodle-shadow)',
      'doodle-md': 'var(--doodle-shadow-md)',
      'doodle-lg': 'var(--doodle-shadow-lg)',
    },
    borderRadius: {
      doodle: 'var(--radius-doodle)',
    },
  },
  shortcuts: [
    // Alias Tailwind v4 linear-gradient syntax to presetWind3 gradient utilities
    ['bg-linear-to-t', 'bg-gradient-to-t'],
    ['bg-linear-to-tr', 'bg-gradient-to-tr'],
    ['bg-linear-to-r', 'bg-gradient-to-r'],
    ['bg-linear-to-br', 'bg-gradient-to-br'],
    ['bg-linear-to-b', 'bg-gradient-to-b'],
    ['bg-linear-to-bl', 'bg-gradient-to-bl'],
    ['bg-linear-to-l', 'bg-gradient-to-l'],
    ['bg-linear-to-tl', 'bg-gradient-to-tl'],

    // doodle-* / wired-border / paper-texture / sketchy-bg live in design-system.css
    ['sketch-border', 'border-3 border-charcoal rounded-doodle'],

    // Card styles matching Figma
    [
      'card',
      'bg-white rounded-lg p-6 shadow-md border border-light-grey transition-all duration-250',
    ],
    ['card-compact', 'card p-4'],
    ['card-elevated', 'card shadow-xl border-green-light'],
    ['card-doodle', 'bg-white rounded-doodle p-6 shadow-doodle border-3 border-charcoal'],

    // Button styles matching Figma
    [
      'btn',
      'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-handwritten font-600 text-base cursor-pointer transition-all duration-250 whitespace-nowrap',
    ],
    [
      'btn-primary',
      'btn bg-green-dark text-white hover:(bg-green-darker translate-y--2) active:translate-y-0',
    ],
    ['btn-secondary', 'btn bg-green-light text-green-darker hover:bg-green-medium'],
    [
      'btn-outline',
      'btn bg-transparent text-green-dark border-2 border-green-dark hover:(bg-green-light border-green-dark text-green-darker)',
    ],
    ['btn-ghost', 'btn bg-transparent text-green-dark hover:bg-[rgba(0,171,57,0.1)]'],
    [
      'btn-doodle',
      'btn bg-white text-charcoal sketch-border shadow-doodle font-sketch font-700 hover:translate-y--3',
    ],
    ['btn-circle', 'btn aspect-square p-0 rounded-full'],
    ['btn-icon', 'btn aspect-square p-2'],
    ['btn-sm', 'btn px-3 py-1.5 text-sm'],

    // Badge styles matching Figma
    [
      'badge',
      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-600 font-handwritten uppercase tracking-wider',
    ],
    ['badge-sm', 'badge px-2 py-0.5 text-xs'],
    ['badge-green', 'badge bg-green-light text-green-darker'],
    ['badge-grey', 'badge bg-light-grey text-charcoal'],
    ['badge-success', 'badge bg-status-success text-white'],
    ['badge-warning', 'badge bg-status-warning text-charcoal'],
    ['badge-error', 'badge bg-status-error text-white'],
    ['badge-info', 'badge bg-status-info text-white'],

    // Input styles
    [
      'input',
      'w-full p-3 rounded-md border-2 border-medium-grey bg-white font-handwritten transition-all duration-250',
    ],
    ['input-doodle', 'input sketch-border'],

    // Stat component styles
    ['stat', 'bg-white rounded-lg p-6 shadow-sm border border-light-grey'],
    ['stat-figure', 'text-green-dark mb-2'],
    ['stat-title', 'text-sm text-dark-grey sketch-title uppercase tracking-wider mb-1'],
    ['stat-value', 'text-3xl font-700 text-charcoal sketch-title leading-none'],
    ['stat-desc', 'text-xs text-dark-grey mt-1'],

    // Hero styles
    ['hero', 'min-h-[60vh] flex items-center justify-center relative overflow-hidden'],
    ['hero-content', 'text-center max-w-2xl px-4'],
    [
      'hero-title',
      'sketch-title text-[clamp(2.5rem,8vw,4rem)] font-700 text-charcoal leading-[1.1] mb-4',
    ],
    [
      'hero-subtitle',
      'font-handwritten text-[clamp(1rem,2.5vw,1.25rem)] text-dark-grey leading-6 max-w-6xl mx-auto mb-16',
    ],

    // Layout utilities
    ['container', 'mx-auto max-w-7xl px-4'],
    ['container-sm', 'mx-auto max-w-6xl px-4'],
    ['container-md', 'mx-auto max-w-5xl px-4'],
    ['container-lg', 'mx-auto max-w-4xl px-4'],

    // Flexbox utilities
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],

    // Gap utilities
    ['gap-xs', 'gap-1'],
    ['gap-sm', 'gap-2'],
    ['gap-md', 'gap-4'],
    ['gap-lg', 'gap-6'],
    ['gap-xl', 'gap-8'],

    // Grid utilities
    ['grid-cols-12', 'grid grid-cols-12'],
    ['col-span-1', 'col-span-1'],
    ['col-span-2', 'col-span-2'],
    ['col-span-3', 'col-span-3'],
    ['col-span-4', 'col-span-4'],
    ['col-span-6', 'col-span-6'],
    ['col-span-8', 'col-span-8'],
    ['col-span-12', 'col-span-12'],

    // Animation utilities
    ['wobble', 'animate-[wobble_3s_ease-in-out_infinite] origin-center'],
    ['gentle-bounce', 'animate-[gentle-bounce_2s_ease-in-out_infinite]'],
    ['float', 'animate-[float_3s_ease-in-out_infinite]'],
    ['pulse', 'animate-[pulse_2s_ease-in-out_infinite]'],
    ['parallax', 'will-change-transform'],
    ['perspective', 'perspective-1000'],
    ['perspective-3d', 'perspective-1200'],

    // Doodle utilities (CSS in design-system.css; aliases for Uno composition)
    ['doodle-card', 'card rounded-doodle shadow-doodle'],
    ['sketch-title', 'font-sketch font-700'],
    ['sketch-subtitle', 'font-sketch font-400'],
    ['hand-drawn', 'font-accent'],
    ['accent-text', 'font-accent'],

    // Legacy shortcuts (for backward compatibility)
    ['card-brut', 'card-doodle'],
    ['ds-card', 'card-doodle'],
    ['ds-muted', 'text-dark-grey'],
    ['ds-btn', 'btn btn-doodle'],
    ['ds-btn-primary', 'ds-btn bg-green-dark text-white'],
    ['ds-btn-outline', 'ds-btn bg-white text-charcoal border-2 border-charcoal'],
    ['badge-doodle', 'badge badge-grey'],

    // Booking status classes
    ['booking-details', 'space-y-4'],
    ['booking-status', 'badge'],
  ],
  safelist: [
    // Custom animation classes from animations.css
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
    'animate-wobble',
    'animate-gentle-bounce',
    'animate-float',
    'animate-pulse',

    // Custom hover effects
    'hover-3d',
    'hover-glow',
    'hover-liquid',
    'hover-morph',

    // Custom utility classes
    'magic-border',
    'doodle-border',
    'doodle-radius',
    'doodle-shadow',
    'doodle-shadow-md',
    'doodle-shadow-lg',
    'doodle-shadow-sm',
    'wired-border',
    'sketch-border',
    'hand-drawn',
    'sketch-title',
    'sketch-subtitle',
    'sketch-underline',
    'squiggle-top',
    'sketchy-bg',
    'paper-texture',
    'highlight-doodle',
    'accent-text',
    'arrow-doodle',
    'border-3',
    'border-5',
    'border-6',
    'border-t-6',
    'border-b-3',
    'bg-brand-blue-light',
    'bg-brand-yellow-light',
    'bg-brand-red-light',
    'bg-terracotta',
    'bg-warm-beige',
    'text-sketch-brown',
    'text-olive',
    'border-brand-blue-dark',
    'border-brand-yellow-dark',
    'border-brand-red-dark',
    'border-terracotta',
    'border-sketch-brown',
    'parallax-layer',
    'particle-network',
    'scrollbar-hide',
    'no-print',

    // Figma design system classes
    'font-handwritten',
    'font-sketch',
    'font-accent',
    'text-charcoal',
    'text-dark-grey',
    'text-light-grey',
    'text-medium-grey',
    'text-green-dark',
    'text-green-darker',
    'text-green-light',
    'text-green-medium',
    'bg-paper-bg',
    'bg-green-light',
    'bg-green-medium',
    'bg-green-dark',
    'bg-green-darker',
    'bg-cream',
    'bg-light-grey',
    'bg-medium-grey',
    'bg-dark-grey',
    'bg-charcoal',
    'bg-status-success',
    'bg-status-warning',
    'bg-status-error',
    'bg-status-info',
    'border-green-dark',
    'border-green-light',
    'border-medium-grey',
    'border-light-grey',

    // Custom shortcuts from components
    'card',
    'card-compact',
    'card-elevated',
    'card-doodle',
    'btn',
    'btn-primary',
    'btn-secondary',
    'btn-outline',
    'btn-ghost',
    'btn-doodle',
    'btn-circle',
    'btn-icon',
    'btn-sm',
    'badge',
    'badge-sm',
    'badge-green',
    'badge-grey',
    'badge-success',
    'badge-warning',
    'badge-error',
    'badge-info',
    'input',
    'input-doodle',
    'stat',
    'stat-figure',
    'stat-title',
    'stat-value',
    'stat-desc',
    'hero',
    'hero-content',
    'hero-title',
    'hero-subtitle',
    'container',
    'flex-center',
    'flex-between',
    'flex-col-center',
    'wobble',
    'gentle-bounce',
    'float',
    'pulse',
    'parallax',
    'perspective',
    'perspective-3d',
    'doodle-card',
    'sketch-title',
    'sketch-subtitle',
    'hand-drawn',
    'accent-text',
    'card-brut',
    'ds-card',
    'ds-muted',
    'ds-btn',
    'ds-btn-primary',
    'ds-btn-outline',
    'badge-doodle',
    'booking-details',
    'booking-status',
  ],
  transformers: [transformerVariantGroup()],
});
