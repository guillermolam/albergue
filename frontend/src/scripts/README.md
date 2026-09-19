# Runtime Scripts

This directory contains small client-side runtime modules used for progressive enhancement.

## Entry point

- `runtime.ts` initializes the progressive-enhancement runtime modules.

The runtime is loaded from layouts:

- `src/layouts/Layout.astro`
- `src/layouts/BaseLayout.astro`

## Data-\* contracts

### CSS and inline SVG UI

Decorative surfaces use UnoCSS utility classes and the shared inline `Icon.astro`
component. This keeps the client runtime small and works with Astro SSR, Swup,
and Vite without a canvas dependency.

Elements can bind to stores and trigger actions:

- `data-store="dailyGoalKm"`
- `data-store="stageProgress"`
- `data-store="remainingDays"`

Actions:

- `data-action="goal:inc" | "goal:dec" | "stage:inc" | "stage:dec" | "progress:sync"`

Example:

```html
<span data-store="dailyGoalKm">25</span>
<button data-action="goal:inc">Increase Goal</button>
<button data-action="progress:sync">Sync Progress</button>
```

## Runtime behavior

- Non-blocking initialization (`queueMicrotask`, `requestAnimationFrame`, `requestIdleCallback` when
  available)
- Idempotent init functions
