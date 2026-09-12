# 🎨 Doodle Design System - Albergue Carrascalejo

## Overview

The Albergue booking system now features a **hand-drawn, doodle-style illustration aesthetic** inspired by DoodleCSS and Wired.js, creating a warm, playful, and rustic-modern experience perfect for the Camino de Santiago pilgrim journey.

## 🖋️ Typography

### Fonts

- **Patrick Hand** - Primary body text (handwritten, casual)
- **Cabin Sketch** - Headings and titles (bold sketch style)
- **Shadows Into Light** - Special accents (flowing handwritten)
- **Indie Flower** - Alternative handwritten style

### Usage

```tsx
className = "hand-drawn"; // Shadows Into Light
className = "sketch-title"; // Cabin Sketch bold
// Default body: Patrick Hand
```

## 🎨 Color Palette

### Primary Colors (Official Extremadura)

- **Green**: `#00AB39` - Primary actions, available beds
- **Blue**: `#0071BC` - Selected items, information
- **Yellow**: `#EAC102` - Reserved/warning states
- **Red**: `#ED1C24` - Occupied/error states

### Rustic Accents

- **Cream**: `#FFF9F0` - Main background
- **Warm Beige**: `#F5E6D3` - Card backgrounds
- **Terracotta**: `#D4A574` - Decorative elements
- **Olive**: `#8B956D` - Secondary text
- **Sketch Brown**: `#5D4E37` - Borders, outlines

## 🎭 Custom Components

### DoodleCard

Hand-drawn card component with sketchy borders

```tsx
<DoodleCard color="#00AB39" delay={0.1}>
  <h3>Your Content</h3>
</DoodleCard>
```

**Features:**

- SVG hand-drawn borders (double-line sketch effect)
- Random squiggle decorations
- Hover animations with rotation
- Paper texture overlay

### WiredButton

Button with hand-drawn wired.js-inspired styling

```tsx
<WiredButton
  variant="primary|secondary|outline"
  size="sm|md|lg"
  onClick={handleClick}
>
  Click Me!
</WiredButton>
```

**Variants:**

- `primary` - Green fill, white text
- `secondary` - Cream fill, brown text
- `outline` - Transparent, green border

**Features:**

- Rough SVG borders with filter effects
- Decorative doodle accent (animated +)
- Spring physics hover animations

### DoodleBadge

Small floating badge with elliptical shape

```tsx
<DoodleBadge color="#00AB39">📍 Location</DoodleBadge>
```

### DoodleBed

Interactive bed visualization for booking grid

```tsx
<DoodleBed
  bedNumber={1}
  status="available|selected|reserved|occupied"
  onClick={handleClick}
/>
```

**Features:**

- Hand-drawn bed illustration with headboard, pillow, sheets
- Status-based coloring
- Interactive animations
- Status icons (checkmark, R, X)

## 🎨 Utility Classes

### Doodle Effects

```css
.doodle-border        /* Asymmetric organic border radius */
.doodle-shadow        /* Offset shadow layers */
.sketch-underline     /* Wavy underline decoration */
.sketchy-bg           /* Cross-hatched background pattern */
.paper-texture        /* Subtle noise/grain overlay */
.wired-border         /* Double sketchy border effect */
.squiggle-top         /* Decorative squiggle above element */
.highlight-doodle     /* Yellow highlighter effect */
.wobble               /* Subtle rotation animation */
```

### Usage Examples

```tsx
<div className="doodle-border doodle-shadow paper-texture">
  <h2 className="sketch-underline">Title</h2>
  <p>
    Some <span className="highlight-doodle">highlighted</span> text
  </p>
</div>
```

## 🎬 Animations

### Spring Physics

All animations use spring physics for organic, natural movement:

```tsx
transition={{ type: "spring", stiffness: 150, damping: 15 }}
```

### Common Patterns

- **Entry**: opacity 0→1, y offset, slight rotation
- **Hover**: scale 1.05, rotate ±2deg
- **Tap**: scale 0.95
- **Wobble**: continuous subtle rotation

## 📐 Layout Principles

### Hand-Drawn Aesthetic

1. **Asymmetry**: Use irregular border-radius values
2. **Layering**: Stack multiple offset borders for depth
3. **Imperfection**: Dashed/dotted strokes, slight rotations
4. **Decoration**: Squiggles, stars, arrows as accents

### Paper & Texture

- Cream/beige backgrounds throughout
- Paper texture overlay on all sections
- Cross-hatched patterns for variety
- Grain/noise filters for authenticity

### Spacing & Rhythm

- Generous padding in doodle cards (p-6)
- Staggered animation delays (delay: index * 0.1)
- Organic spacing with decorative elements

## 🎯 Page-Specific Features

### Hero Section

- Parallax scrolling background
- Floating doodle badges with emojis
- Hand-drawn scroll indicator
- Wobbling title text
- Sketch underline on tagline

### Navigation

- Hand-drawn SVG logo with animated star
- Squiggly active underline (SVG path animation)
- Language switcher with elliptical SVG button
- Mobile menu with doodle-border cards

### Booking Grid

- DoodleBed components in 3×4 / 4×6 grid
- Color-coded dormitories
- Hand-drawn legend with sketchy circles
- Date picker with doodle-border styling

### Features Section

- Emoji icons (instead of SVG icons)
- DoodleCard grid layout
- Hand-drawn arrow decorations
- Floating background doodles

## 🔧 Technical Stack

### Compatible with Astro/TypeScript/Vite

- All components are framework-agnostic React
- CSS custom properties for theming
- SVG for hand-drawn effects (no external libs needed)
- Motion/React for animations

### No External Doodle Libraries

We've implemented DoodleCSS and Wired.js aesthetics using:

- Custom SVG paths and filters
- CSS border-radius tricks
- Tailwind utility classes
- Motion animations

## 🎨 Design Inspirations

✅ **DoodleCSS** - Asymmetric borders, playful shapes  
✅ **Wired.js** - Hand-drawn SVG borders, rough aesthetics  
✅ **DaisyUI** - Component patterns and structure  
✅ **Rustic Modern** - Warm colors, natural materials, clean layouts

## 📱 Responsive Behavior

- Grid columns adjust: 3 → 4 → 6 columns
- Typography scales: text-4xl → text-6xl
- Badges stack/wrap on mobile
- Animations respect prefers-reduced-motion

## 🚀 Performance

- SVG filters cached by browser
- CSS animations hardware-accelerated
- Motion uses transform/opacity (composited properties)
- Lazy animation triggers (whileInView)

---

**Result**: A unique, memorable booking experience that feels hand-crafted, warm, and perfectly suited to the pilgrim journey aesthetic of the Camino de Santiago.
