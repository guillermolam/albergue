# Plan: Rough Pencil-Stroke Border Texture for UI Components

## Context

**Status**: Planning (image reference could not be read — model does not support image input)

The user wants CSS/Tailwind utility classes or shader code to apply a texture of
rough, uneven pencil strokes forming double/triple frames (~2.5px stroke width)
to a UI component. The effect should look hand-drawn, responsive, and performant.

## Current Project Styling Infrastructure

This project uses **UnoCSS** (Tailwind v3-style utilities with atomic CSS) with
a CSS baseline in two files:

| File | Role |
|------|------|
| `frontend/src/styles/design-system.css` | Custom component classes (`doodle-border`, `wired-border`, `paper-texture`, `sketch-underline`, `sketchy-bg`) |
| `frontend/src/styles/global.css` | Baseline duplicates (legacy) |
| `frontend/uno.config.ts` | UnoCSS config – color tokens, shortcuts, safelist |
| `frontend/src/styles/animations.css` | Custom keyframes and animation-driven border effects (`magic-border`, `particle-network`) |

### Existing relevant patterns

1. **`wired-border`** (`global.css:525`, `design-system.css:369`) — Double border
   via `::before`/`::after` with **different asymmetric `border-radius`** values
   (255px 15px 225px 15px vs. 15px 255px 15px 225px). This offset creates a
   "shifted" look that already hints at hand-drawn irregularity. Opacity 0.18/0.10.

2. **`sketch-underline`** (`design-system.css:404`) — Squiggly underline via an
   inline SVG data-URI `path` using quadratic Bézier curves
   (`M0,2 Q5,0 10,2 T20,2 T30,2 ...`).

3. **`paper-texture`** (`design-system.css:455`) — Fractal-noise SVG filter at
   0.03 opacity for paper grain.

4. **`sketchy-bg`** (`design-system.css:437`) — Cross-hatch `repeating-linear-gradient`.

## Recommended Approach: CSS + Inline SVG (no canvas/WebGL)

For a **responsive, performant** pencil-stroke border, **pure CSS with inline SVG
data-URI backgrounds** is the best approach. Canvas/WebGL is overkill — this effect
is static decoration, not real-time animation, and CSS leverages GPU
compositing for free.

### Why not canvas/WebGL?

- The effect is a **static decorative border**, not a dynamic simulation.
- Canvas would require an extra `<canvas>` element per component and manual
  resize handling — worse perf than CSS `::before`/`::after`.
- WebGL (e.g. shaders) is justified only for animated procedural noise that
  changes every frame; the existing `paper-texture` already covers static
  grain at 0.03 opacity via a tiny SVG filter.

### Technique: Layered SVG stroke paths on pseudo-elements

The core idea: replace solid `border` with **SVG path strokes** rendered as
`background-image` data URIs on `::before`, `::after`, and (optionally) `::after`
of a wrapper `::after`. Each path is a rectangle outline but with **deliberately
jittered control points** to simulate hand-drawn irregularity.

### Step 1: Generate a "rough rectangle" SVG path

A standard rect path: `M4 4 H96 V96 H4 Z` (too perfect).

A rough/jittered version using alternating quadratic curves:

```
M X1 Y1 Q X2 Y2 X3 Y1 T X5 Y1 T X7 Y1 ...
```

Each segment has a control point offset by ±0.5–1px to create the "shaky hand"
look. With 2.5px stroke width, the jitter is ~10–15% of the stroke — visible but
subtle.

**Generation strategy**: Create the SVG paths inline in CSS as data URIs. Three
variants (outer, middle, inner) with progressively smaller jitter so the borders
look hand-drawn but nested.

### Step 2: Build the Tailwind utility classes

Add to `frontend/uno.config.ts` shortcuts (or as dedicated classes in
`design-system.css`):

```
// Triple rough pencil border
'sketchy-border': 'relative border-0',
'sketchy-border::before': { ... },
```

Since UnoCSS `variantGroup` supports `::before`/`::after`, the cleanest approach
is **raw CSS classes** in `design-system.css` (matching the existing
`doodle-border`, `wired-border` pattern).

### Step 3: CSS implementation (in `design-system.css`)

```css
/* Pencil-stroke texture: 2.5px wobbly borders, triple-layered */
.sketchy-border {
  position: relative;
  border: none;
}

/* Shared path — a rectangle with hand-drawn jitter */
/* Replace <PATH_DATA> with actual jittered path strings */

.sketchy-border::before,
.sketchy-border::after,
.sketchy-border > .sketchy-border-inner {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0; /* disable rounded so SVG path controls corner shape */
  pointer-events: none;
  background-repeat: repeat;
}

/* Outer stroke — 2.5px, darkest */
.sketchy-border::before {
  background-image: url("data:image/svg+xml,…");
  background-size: 100% 100%;
  filter: drop-shadow(0.5px 0.5px 0 #0002);
}

/* Middle stroke — 2.5px, offset, semi-transparent */
.sketchy-border::after {
  inset: -1px;
  background-image: url("data:image/svg+xml,…");
  background-size: calc(100% + 2px) calc(100% + 2px);
  opacity: 0.5;
}

/* Inner stroke — 2.5px, inset */
.sketchy-border > .sketchy-border-inner {
  inset: 2px;
  background-image: url("data:image/svg+xml,…");
  background-size: calc(100% - 4px) calc(100% - 4px);
  opacity: 0.3;
}
```

### Step 4: Generating the SVG data URIs

Each border layer needs its own SVG with a jittered rect path. The SVG is
**100×100 viewBox** so it scales to any element size via `background-size: 100% 100%`.

The jittered path for a 100×100 square (2.5px stroke, hand-drawn feel):

```svg
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M5,5
       Q8,2 12,5
       T25,5
       Q30,8 35,5
       T50,5
       Q58,2 65,5
       T80,5
       Q88,8 88,5
       T95,5
       Q92,10 90,12
       T90,25
       ..."
    fill="none"
    stroke="#5D4E37"
    stroke-width="2.5"
    stroke-linejoin="round"
    stroke-linecap="round"
  />
</svg>
```

Each corner gets a quadratic Bézier control point that deviates ±2–3px from the
ideal corner, creating the "uneven hand-drawn" appearance. The path is a closed
loop walking clockwise around the perimeter.

### Step 5: Responsiveness

- SVG uses `width="100" height="100"` with `viewBox="0 0 100 100"` — scales
  perfectly to any element via `background-size: 100% 100%`.
- `background-size` uses `calc()` with `inset` values so each layer scales
  independently.
- For high-DPI displays, the SVG stroke renders crisply (vector-based). No
  media query needed.
- To avoid excessive jitter on very small elements, the path deviation should be
  proportional: ~2.5% of element dimension. For a 100×100 SVG, that's ±2.5px.
  For tiny elements, this may look too noisy — add a `min-width` guard or
  simplified path variant.

### Step 6: Performance

- **Single HTTP request** — SVG is inlined as data URI (zero network cost).
- **GPU-accelerated** — `background-image` on a positioned element composites on
  the GPU; `::before`/`::after` are cheap pseudo-elements.
- **No JS** — pure CSS, no animation frames.
- **Reused** — data URI can be extracted to a named class (`.sketchy-border`)
  and applied via `className="sketchy-border"` or via UnoCSS shortcut.

### Step 7: Tailwind/UnoCSS integration

Add a shortcut to `uno.config.ts`:

```ts
['sketchy-border', 'relative border-0'],
```

Then use as raw CSS classes in `design-system.css` (since UnoCSS can't generate
pseudo-element background-image utilities dynamically without explicit
configuration).

Or, if the user prefers inline Tailwind classes (no new CSS), compose:

```tsx
className="relative border-0 before:absolute before:inset-0 before:bg-[url(...)] before:bg-[100%_100%] after:absolute after:inset-[-1px] after:bg-[url(...)] after:opacity-50"
```

However, **the data-URI string is extremely long** for inline Tailwind. The
project convention (`wired-border`, `doodle-border` all use named classes in
`design-system.css`) strongly favors the **dedicated CSS class** approach.

## Alternative: CSS `conic-gradient` + `filter: noise`

A lighter-weight but less authentic alternative:

```css
.sketchy-border {
  background:
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      #5D4E37,
      #5D4E37 5deg,
      transparent 5deg,
      transparent 10deg
    ),
    /* same rotated 3 times for 4 sides */;
  filter: url(#noise);
}
```

This produces a **dashed** effect, not a continuous wobbly stroke. Less authentic.
The SVG path approach is preferred for the "drawn with a pencil" continuous-stroke
look.

## Files to modify

| File | Change |
|------|--------|
| `frontend/src/styles/design-system.css` | Add `.sketchy-border` + pseudo-element rules with SVG data URIs |
| `frontend/uno.config.ts` | Add `sketchy-border` to safelist; add shortcut alias if desired |
| `frontend/src/styles/global.css` | Add matching `.sketchy-border` (legacy baseline parity) |
| Component file | Apply `className="sketchy-border"` to target element |

## Usage Example

```tsx
<div className="rounded-xl bg-[#FFFFFF] p-6 sketchy-border paper-texture sketchy-bg">
  {/* content */}
</div>
```

- `sketchy-border` = triple pencil-stroke frame (outer ~2.5px dark, middle ~2.5px
  semi-transparent offset, inner ~2.5px light inset)
- `paper-texture` = existing paper grain overlay
- `sketchy-bg` = existing cross-hatch fill (optional)

## Out of Scope

- Animated pencil-stroke "drawing" effect (would require SVG path animation —
  see project's existing `animate-typewriter` pattern if needed later)
- Dynamic per-element jitter (would require JS canvas — not justified for static decoration)
