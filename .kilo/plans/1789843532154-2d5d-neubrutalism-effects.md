# 2.5D / Neubrutalism Hand-Drawn Pencil Sketch Effects

## Goal

Apply hard-offset 2.5D shadow effects, double-pencil extrusion (optional), and SVG displacement filters (optional) to all UI components using **pure Tailwind CSS v4 utilities** — no custom CSS classes for shadows.

## Context

The project (`frontend/`) uses UnoCSS with `presetWind3()` for atomic class generation and Tailwind v4 (`@import 'tailwindcss'`) for theme/layers. Components currently use soft shadows (`shadow-lg`, `shadow-xl`) or SVG-based shadow layers. The goal is consistent 2.5D/Neubrutalism aesthetics across all components.

## Design Tokens (existing in `src/styles/design-system.css`)

- `--shadow-hard`: hard offset shadow value
- `--r-*`: border-radius tokens
- These may be referenced or replaced by inline Tailwind arbitrary values.

## Strategy Mapping

| Strategy | When | Pattern |
|----------|------|---------|
| **1. Hard offset shadow** | Default state for cards, buttons, containers | `shadow-[6px_6px_0px_0px_#1a1a1a]` + `active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#1a1a1a]` |
| **2. Double-pencil extrusion** | Elevated/variant elements needing depth | `before:absolute before:bg-black/10 before:rounded-[inherit] before:translate-x-[3px] before:translate-y-[3px]` on container with `relative` |
| **3. SVG displacement filter** | Showcase/hero elements (organic distortion) | Inline `<svg>` with `<filter id="displacement">` + `style="filter:url(#displacement)"` on wrapper (use sparingly) |

## Components to Update

### Doodle Components
- `src/components/doodle/DoodleCard.astro` — Replace soft shadow with hard offset; add `active:` press state
- `src/components/doodle/SketchyButton.astro` — Replace SVG shadow layer with Tailwind 2.5D classes
- `src/components/doodle/DoodleButton.astro` — Apply Strategy 1 shadow pattern
- `src/components/doodle/DoodleBadge.astro` — Apply Strategy 1 with smaller offset (`4px_4px`)

### Core Components
- `src/components/Button.astro` — Strategy 1 with primary color variations
- `src/components/Card.astro` — Strategy 1, respect existing `--r-*` radius tokens
- `src/components/Hero.astro` — Strategy 1 for container; Strategy 3 optional for headline
- `src/components/FeatureCard.astro` — Uses DoodleCard internally; ensure consistency

### UI Components (Figma-matching)
- `src/components/ui/Button.astro` — Strategy 1 with daisyUI-compatible override
- `src/components/ui/Card.astro` — Strategy 1, double-pencil for elevated variants
- `src/components/ui/Input.astro` — Strategy 1 with `4px_4px` offset, `active:` press
- `src/components/ui/Hero.astro` — Strategy 1 for container

### Layouts
- `src/layouts/Layout.astro` — 2.5D container style for main content area
- `src/layouts/BaseLayout.astro` — Minimal 2.5D wrapper
- `src/layouts/AuthLayout.astro` — 2.5D card container (already has doodle fonts)
- `src/layouts/AdminLayout.astro` — Special: daisyUI components need `daisy-` prefix preservation; override card/button shadows with inline `shadow-[...]`

## Interaction States (all components)

```
hover: translate-x-[1px] translate-y-[1px] shadow-[smaller-offset]  (lift effect)
active: translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#1a1a1a]  (press effect)
```

## Transition

Add to affected elements: `transition-all duration-150 ease-out`

## Reusable Utility Classes (define in `src/styles/design-system.css` as `@apply` aliases or add to `uno.config.ts` custom rules)

```css
/* In design-system.css */
.shadow-25d { box-shadow: 6px 6px 0px 0px #1a1a1a; }
.shadow-25d-active { box-shadow: 2px 2px 0px 0px #1a1a1a; transform: translate(2px, 2px); }
.shadow-25d-hover { box-shadow: 4px 4px 0px 0px #1a1a1a; transform: translate(1px, 1px); }
```

Or add as UnoCSS preset shortcuts in `uno.config.ts`:
```ts
shortcuts: {
  'shadow-25d': 'shadow-[6px_6px_0px_0px_#1a1a1a]',
  'shadow-25d-active': 'active:shadow-[2px_2px_0px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px]',
}
```

## Implementation Order

1. **Define reusable 2.5D utility shortcuts** in `uno.config.ts` or `design-system.css`
2. **Update DoodleCard** — base card pattern reference
3. **Update Button & Card** — core primitives
4. **Update DoodleButton, DoodleBadge** — small components
5. **Update Hero, FeatureCard** — larger layouts
6. **Update UI components** (ui/Button, ui/Card, ui/Input, ui/Hero)
7. **Update Layouts** (Layout, BaseLayout, AuthLayout, AdminLayout)
8. **Add transition utilities** to all interactive elements
9. **Verify**: `pnpm build` and `pnpm typecheck`

## Verification

- `pnpm build` completes without errors
- `pnpm typecheck` passes
- Visual check: all buttons/cards have hard offset shadows, press states reduce shadow + shift element, hover states slightly lift
- No custom CSS shadow classes used — all via Tailwind `shadow-[...]` arbitrary values
- daisyUI components in AdminLayout preserve their `daisy-` prefix while gaining 2.5D shadow overrides
