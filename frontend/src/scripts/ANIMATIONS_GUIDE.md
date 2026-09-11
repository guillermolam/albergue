# 🎬 Mind-Blowing Complex Animations Guide

This project now includes **15+ complex, production-ready animations** powered by:
- **@swup/astro** - Page transitions
- **View Transitions API** - Native browser animations
- **Custom CSS** - Complex keyframe animations
- **Intersection Observer** - Scroll-triggered animations

---

## 🚀 Quick Start

### 1. Add to your layout
```astro
<!-- In your layout file -->
import '../styles/animations.css';

<html lang="es">
  <head>
    <!-- Enable view transitions -->
    <meta name="view-transition" content="same-origin" />
  </head>
  <body>
    <!-- Swup container with animation class -->
    <div id="swup" class="transition-fade-scale">
      <!-- Your content -->
    </div>
  </body>
</html>
```

---

## 🎨 Page Transition Animations

### Available Classes (Add to `#swup` element)

| Class | Effect | Best For |
|-------|--------|----------|
| `transition-fade-scale` | Fade with subtle scale | Default, elegant |
| `transition-slide-fade` | Slide from side with fade | Modern apps |
| `transition-3d-perspective` | **3D depth effect** | Premium feel |
| `transition-morph` | **Liquid circle morph** | Creative sites |
| `transition-warp` | **Warp speed blur** | Sci-fi/futuristic |
| `transition-glitch` | **Cyberpunk glitch** | Edgy/tech sites |
| `transition-particle` | **Particle dissolve** | Playful/magical |
| `transition-liquid` | **Bubble morph** | Organic/natural |

### Usage Example
```astro
<div id="swup" class="transition-3d-perspective">
  <slot />
</div>
```

---

## ✨ Complex Element Animations

### 1. Floating 3D Animation
```astro
<div class="animate-float-3d">
  <!-- Element floats in 3D space -->
</div>
```
- **8-second infinite loop**
- **Multi-axis rotation** (X, Y, Z)
- **Dynamic shadows**
- **Perspective depth**

### 2. Particle Swarm
```astro
<div class="animate-particle"></div>
```
- **3-second infinite loop**
- **Swarm behavior**
- **Fade in/out**
- **Random movement**

### 3. Neon Glow Pulse
```astro
<div class="animate-neon-pulse"></div>
```
- **2-second pulse**
- **Multi-layer glow**
- **Scale breathing**
- **CurrentColor support**

### 4. Morphing Path (SVG)
```astro
<svg>
  <path class="animate-morph-path" d="M0,0 L100,0 L100,100 L0,100 Z" />
</svg>
```
- **4-second morph**
- **Square → Diamond → Square**
- **Smooth transitions**

### 5. Rotating Gradient
```astro
<div class="animate-rotating-gradient">
  <!-- Background will rotate -->
</div>
```
- **8-second rotation**
- **4-color gradient**
- **Seamless loop**

### 6. Typewriter Effect
```astro
<span class="animate-typewriter">
  Typewriter text effect
</span>
```
- **3-second typing**
- **40-step animation**
- **Blinking cursor**

### 7. Shimmer Effect
```astro
<div class="animate-shimmer"></div>
```
- **1.5-second loop**
- **Skeleton loading**
- **Light reflection**

### 8. Bounce with Perspective
```astro
<div class="animate-bounce-3d">
  <!-- Bounces in 3D -->
</div>
```
- **2-second infinite**
- **Multi-bounce pattern**
- **Perspective preservation**

---

## 📜 Scroll-Triggered Animations

### Classes
- `animate-on-scroll` - Fade up (default)
- `animate-on-scroll-left` - Slide from left
- `animate-on-scroll-right` - Slide from right
- `animate-on-scroll-scale` - Scale up
- `animate-on-scroll-rotate` - Rotate in

### Usage
```astro
<div class="animate-on-scroll">
  This will animate when it enters the viewport
</div>
```

### JavaScript (Add to your layout)
```astro
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
</script>
```

---

## 🖱️ Hover Effects

| Class | Effect |
|-------|--------|
| `hover-3d` | 3D perspective rotation |
| `hover-liquid` | Liquid shuffle background |
| `hover-glow` | Multi-layer glow |
| `hover-morph` | Morph to circle + rotate |

### Usage
```astro
<button class="hover-3d">
  Hover for 3D effect
</button>

<div class="hover-liquid p-8">
  Hover for liquid background
</div>

<div class="hover-glow">
  Hover for glow
</div>

<div class="hover-morph bg-primary">
  Hover to morph
</div>
```

---

## 🎭 Special Effects

### 1. Magic Border
```astro
<div class="magic-border p-8">
  <h2>Content with magic border</h2>
</div>
```
- **Animated gradient border**
- **Hover to reveal**
- **Auto-rotating colors**

### 2. Particle Network Background
```astro
<div class="particle-network">
  <!-- Content on top of particle network -->
</div>
```
- **Radial gradient overlay**
- **Multiple light sources**
- **Brand colors**

---

## 🧩 Custom Animation Hooks

### For Complex Multi-Element Animations

Import and use the animation plugins:

```astro
---
import {
  complexAnimationsPlugin,
  perspectiveAnimationPlugin,
  morphAnimationPlugin,
  glitchAnimationPlugin,
  warpAnimationPlugin
} from '../scripts/swup-animations';

// These auto-register with swup
---
```

### HTML with Data Attributes
```html
<div data-animate-in="fade">
  Animates in with fade
</div>

<div data-animate-in="slide" data-animate-out="slide">
  Custom in and out animations
</div>
```

### Available Data Attributes
- `data-animate-in` - Animation when element enters
  - Values: `fade`, `slide`, `scale`, `rotate`, or custom
- `data-animate-out` - Animation when element leaves
  - Values: Same as above
- `data-swup-animation` - Swup animation selector

---

## 🎯 Per-Page Animation Selection

You can change the animation class per page:

```astro
<!-- pages/index.astro -->
<div id="swup" class="transition-fade-scale">
  <!-- Homepage with fade-scale -->
</div>

<!-- pages/about.astro -->
<div id="swup" class="transition-3d-perspective">
  <!-- About page with 3D perspective -->
</div>

<!-- pages/contact.astro -->
<div id="swup" class="transition-morph">
  <!-- Contact page with morph effect -->
</div>
```

---

## 🔧 Customizing Animations

### 1. Modify Duration
```css
.transition-3d-perspective {
  transition:
    transform 2s cubic-bezier(0.25, 1, 0.5, 1), /* Changed from 1.2s to 2s */
    opacity 2s ease-out,
    box-shadow 2s ease-out;
}
```

### 2. Change Easing Functions
- `cubic-bezier(0.4, 0, 0.2, 1)` - Ease-out (default)
- `cubic-bezier(0.25, 0.46, 0.45, 0.94)` - Ease-in-out
- `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bounce/elastic
- `ease-in-out` - Standard
- `steps(2, end)` - Instant (glitch effect)

### 3. Combine Animations
```css
.combined-animation {
  animation:
    float3d 8s ease-in-out infinite,
    neonPulse 2s ease-in-out infinite;
}
```

---

## 📱 Touch & Mobile Considerations

All animations include:
- ✅ **`will-change`** for performance
- ✅ **`transform-style: preserve-3d`** where applicable
- ✅ **`backface-visibility: hidden`** for smooth rendering
- ✅ **Reduced motion support**

```css
/* Automatically respects prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Performance Tips

1. **Use `will-change`** for animated elements
   ```css
   .element {
     will-change: transform, opacity;
   }
   ```

2. **Use `transform` instead of `top/left`**
   ```css
   /* ✅ Good */
   .element { transform: translateX(100px); }
   
   /* ❌ Bad */
   .element { left: 100px; }
   ```

3. **Use `opacity` instead of `visibility`**
   ```css
   /* ✅ Good */
   .element { opacity: 0; }
   
   /* ❌ Bad */
   .element { visibility: hidden; }
   ```

4. **Limit animation count** - Don't animate more than 50 elements simultaneously

5. **Use passive event listeners**
   ```javascript
   element.addEventListener('scroll', handler, { passive: true });
   ```

---

## 🎓 Best Practices

### 1. Loading States
```astro
<div class="animate-shimmer h-4 w-48 mb-4"></div>
<div class="animate-shimmer h-4 w-32"></div>
```

### 2. Attention Grabbers
```astro
<button class="hover-glow hover-3d transition-all">
  Click Me
</button>
```

### 3. Hero Sections
```astro
<section class="relative overflow-hidden">
  <div class="particle-network"></div>
  <div class="relative z-10 animate-on-scroll">
    <h1 class="text-5xl font-bold">Welcome</h1>
  </div>
</section>
```

### 4. Cards
```astro
<div class="magic-border p-6 animate-on-scroll-scale">
  <h3>Card Title</h3>
  <p>Content with magic border and scale animation</p>
</div>
```

---

## 🌈 Brand Colors Integration

All animations use `currentColor` where possible, so they automatically inherit your brand colors:

```astro
<div class="text-primary animate-neon-pulse">
  <!-- Pulse will use primary color -->
</div>

<div class="text-yellow animate-glow">
  <!-- Glow will use yellow color -->
</div>
```

---

## 📚 References

- [Swup Documentation](https://swup.js.org/getting-started/demos/)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [CSS Animations MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [CSS Transitions MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

---

## ✨ Demo Page

Create a demo page to showcase all animations:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Animation Demo">
  <main class="container mx-auto py-16 space-y-20">
    <!-- Page Transition Demo -->
    <section>
      <h2 class="text-3xl font-bold mb-8">Page Transitions</h2>
      <p>Click navigation links to see page transitions in action!</p>
    </section>

    <!-- Element Animations -->
    <section>
      <h2 class="text-3xl font-bold mb-8 animate-typewriter">Element Animations</h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="animate-float-3d bg-white p-8 rounded-xl shadow-lg">
          <h3>3D Float</h3>
          <p>Hover to see 3D floating effect</p>
        </div>
        
        <div class="animate-neon-pulse w-16 h-16 bg-primary rounded-full mx-auto"></div>
        
        <div class="animate-shimmer h-12 bg-gray-200 rounded"></div>
        
        <div class="hover-3d bg-white p-8 rounded-xl">
          <h3>3D Hover</h3>
          <p>Hover me!</p>
        </div>
        
        <div class="hover-liquid bg-white p-8 rounded-xl">
          <h3>Liquid Hover</h3>
          <p>Hover me!</p>
        </div>
        
        <div class="magic-border p-8">
          <h3>Magic Border</h3>
          <p>Hover me!</p>
        </div>
      </div>
    </section>

    <!-- Scroll Animations -->
    <section class="space-y-8">
      <h2 class="text-3xl font-bold mb-8">Scroll Animations</h2>
      
      <div class="animate-on-scroll h-24 bg-blue-100 rounded">
        <p>This fades in as you scroll</p>
      </div>
      
      <div class="animate-on-scroll-left h-24 bg-green-100 rounded">
        <p>This slides in from left</p>
      </div>
      
      <div class="animate-on-scroll-right h-24 bg-yellow-100 rounded">
        <p>This slides in from right</p>
      </div>
      
      <div class="animate-on-scroll-scale h-24 bg-red-100 rounded">
        <p>This scales up</p>
      </div>
      
      <div class="animate-on-scroll-rotate h-24 bg-purple-100 rounded">
        <p>This rotates in</p>
      </div>
    </section>
  </main>
</Layout>
```

---

## 🎉 All Animation Types Summary

### Page Transitions (8)
1. ✅ Fade with Scale
2. ✅ Slide with Fade
3. ✅ 3D Perspective
4. ✅ Morphing Circles
5. ✅ Warp Speed
6. ✅ Glitch Effect
7. ✅ Particle Dissolve
8. ✅ Liquid Bubble

### Element Animations (8)
1. ✅ 3D Float
2. ✅ Particle Swarm
3. ✅ Neon Glow Pulse
4. ✅ Morphing Path
5. ✅ Rotating Gradient
6. ✅ Typewriter
7. ✅ Shimmer
8. ✅ 3D Bounce

### Scroll Animations (5)
1. ✅ Fade Up
2. ✅ Slide Left
3. ✅ Slide Right
4. ✅ Scale Up
5. ✅ Rotate In

### Hover Effects (4)
1. ✅ 3D Perspective
2. ✅ Liquid Background
3. ✅ Glow
4. ✅ Morph

### Special Effects (2)
1. ✅ Magic Border
2. ✅ Particle Network

**Total: 27 Complex Animations!** 🚀
