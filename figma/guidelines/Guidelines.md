# Albergue Municipal de Carrascalejo - Design & Development Guidelines

## Project Overview

**Purpose**: Booking system for a pilgrim hostel on the Camino de Santiago route in Extremadura, Spain  
**Target Users**: Pilgrims, hostel staff, administrators  
**Tech Stack**: React, TypeScript, Tailwind CSS 4.0, Motion (Framer Motion), Recharts, React Router

---

## 🎨 Design System

### Core Design Philosophy

**"Hand-Drawn Doodle Hospitality"**
- Inspired by **DoodleCSS** and **Wired.js** for sketchy, organic elements
- Combines **hospitality warmth** with **clean functionality**
- **Spectacular 3D effects** with shadows, ripples, and depth
- **Micro animations** everywhere for delightful interactions
- **Parallax scrolling** and 3D components preferred over vertical scrolling

### Color Palette (STRICT - Only These Colors)

```css
/* Greens */
--green-light: #E8F5E9      /* Backgrounds, accents */
--green-medium: #66BB6A     /* Secondary elements */
--green-dark: #00AB39       /* Primary brand color */
--green-darker: #006b24     /* Sidebar, headers */

/* Greys */
--cream: #FAFAFA           /* Warm backgrounds */
--light-grey: #F5F5F5      /* Cards, surfaces */
--medium-grey: #E8E8E8     /* Borders, dividers */
--dark-grey: #4A4A4A       /* Secondary text */
--charcoal: #1A1A1A        /* Primary text */

/* Neutrals */
--white: #FFFFFF           /* Pure white */
--black: #000000           /* Pure black (use sparingly) */

/* Accent Backgrounds */
--paper-bg: #FFF9F0        /* Main page background */
```

**❌ NEVER USE**: Blues, reds, yellows, purples, oranges (except for status indicators where absolutely necessary)

---

### Typography

**Font Families** (Already imported in globals.css):
- **Primary Body**: `'Patrick Hand', cursive` - All body text, inputs, buttons
- **Headings**: `'Cabin Sketch', cursive` - H1, H2, H3, brand names
- **Handwritten Accents**: `'Shadows Into Light', cursive` - Special annotations, helper text

**Usage Rules**:
```css
.hand-drawn    { font-family: 'Shadows Into Light', cursive; }
.sketch-title  { font-family: 'Cabin Sketch', cursive; font-weight: 700; }
/* Default body uses Patrick Hand automatically */
```

**Font Sizing**:
- Do NOT add Tailwind font-size classes (text-2xl, text-lg, etc.) unless explicitly requested
- Do NOT add font-weight classes (font-bold, etc.) unless explicitly requested
- Typography is handled globally in `/styles/globals.css`

---

### Visual Style Elements

#### Doodle Borders & Shadows

```tsx
// Organic, hand-drawn border radius
className="doodle-border"  // radius: 255px 15px 225px 15px/15px 225px 15px 255px

// Layered sketch shadow
className="doodle-shadow"  // Multiple offset shadows for depth

// Wired-style double border
className="wired-border"   // SVG-style overlapping borders
```

#### Sketchy Decorations

```tsx
// Squiggly underline
className="sketch-underline"

// Wavy top decoration
className="squiggle-top"

// Crosshatch background
className="sketchy-bg"

// Paper texture (use on page backgrounds)
className="paper-texture"
```

#### Animation Classes

```tsx
className="wobble"           // Gentle rotation animation (3s loop)
```

**Always use Motion for custom animations**:
```tsx
import { motion } from 'motion/react';

// Infinite bounce
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
/>

// Parallax on mouse move (global effect)
// Already implemented in HomePage
```

---

## 📱 Layout & Responsiveness

### Critical Rule: NO HORIZONTAL SCROLLING

**Every page MUST**:
```tsx
className="overflow-x-hidden w-full max-w-[100vw]"
```

**Global CSS** (already in globals.css):
```css
html, body {
  max-width: 100vw;
  overflow-x-hidden;
}
```

### Responsive Grid Patterns

```tsx
// Cards/Stats: Mobile → Tablet → Desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

// Two-column forms
className="grid grid-cols-1 lg:grid-cols-2 gap-6"

// Tables: Allow internal horizontal scroll
<div className="overflow-x-auto">
  <table className="w-full min-w-[800px]">
</div>
```

### Sidebar Layouts

**Fixed Sidebar Pattern** (Booking, Dashboard, Admin):
```tsx
<div className="flex overflow-x-hidden w-full max-w-[100vw]">
  {/* Sidebar */}
  <aside className="w-80 flex-shrink-0 ...">
    {/* Fixed width, won't compress */}
  </aside>
  
  {/* Content */}
  <main className="flex-1 relative">
    {/* Fills remaining space */}
  </main>
</div>
```

### Breakpoints

- **Mobile**: < 768px (320px minimum)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🏗️ Application Structure

### Pages & Routing

```
/                → HomePage (immersive parallax landing)
/book            → NewBookingFlow (7-step wizard, no top nav)
/dashboard       → GuestDashboard (post-booking, left sidebar)
/admin           → AdminLayout
  /admin/        → Dashboard
  /admin/bookings → BookingsTable
  /admin/beds    → BedManagement
  /admin/guests  → (placeholder)
  /admin/analytics → (placeholder)
  /admin/settings → (placeholder)
```

### Navigation Rules

1. **HomePage**: Full navigation menu in hero section
2. **Booking Flow**: NO top navigation (only stepper in left sidebar)
3. **Guest Dashboard**: Left sidebar menu ONLY (appears after booking complete)
4. **Admin Panel**: Fixed left sidebar with dark green background

---

## 📋 Booking Flow (7 Steps)

### Step-by-Step Requirements

1. **Date Picker** (`DatePickerStep`)
   - Custom doodle calendar with hand-drawn styling
   - Check-in and check-out selection
   - Show availability indicators

2. **ID Upload & OCR** (`IDUploadStep`)
   - Drag-and-drop file upload with doodle styling
   - Mock OCR extraction (DNI/Passport)
   - Auto-prefill form data

3. **Pilgrim Information** (`PilgrimFormStep` / `PilgrimCard`)
   - Form with doodle inputs
   - Pre-filled from OCR data
   - Phone input with country code
   - Address autocomplete

4. **Bed Selection** (`BedSelectionStep`)
   - **3D isometric bed layout**
   - 2 dorms × 12 beds each (24 total)
   - Interactive hover states with shadows
   - Color-coded status: available (green), occupied (grey), selected (dark green)

5. **Payment** (`PaymentStep`)
   - Mock payment form (Card, Cash, Transfer)
   - Doodle-styled inputs
   - Security indicators

6. **Summary** (within PaymentStep)
   - Review all details
   - Confirm booking button

7. **Confirmation** → Navigate to `/dashboard`

### Floating Cost Summary

**Critical Component**: `PriceSummaryModal`
- **MUST persist across ALL booking steps**
- Expandable/collapsible modal
- Shows:
  - Dates
  - Number of beds
  - Nights
  - Price per night (€10)
  - Total amount
  - Breakdown with animations
- Positioned: Fixed bottom-right (mobile: bottom)
- Expandable to show full details

```tsx
<PriceSummaryModal
  checkInDate={date}
  checkOutDate={date}
  selectedBeds={[1, 2]}
  pricePerNight={10}
  isExpanded={boolean}
  onToggle={() => ...}
/>
```

---

## 🎯 Component Guidelines

### Doodle Components (in `/components/doodle/`)

Always use these for consistency:

```tsx
import { WiredButton } from './doodle/WiredButton';
import { DoodleCard } from './doodle/DoodleCard';
import { DoodleBadge } from './doodle/DoodleBadge';
import { WiredCalendar } from './doodle/WiredCalendar';
import { IDUpload } from './doodle/IDUpload';
import { PhoneInput } from './doodle/PhoneInput';
import { DateTimePicker } from './doodle/DateTimePicker';
```

**WiredButton Variants**:
```tsx
<WiredButton variant="primary">   {/* Green, filled */}
<WiredButton variant="secondary"> {/* Outlined */}
<WiredButton variant="ghost">     {/* Text only */}
```

### Animation Patterns

**Card Hover**:
```tsx
<motion.div
  whileHover={{ 
    scale: 1.02, 
    rotateZ: 1,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)" 
  }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

**Page Transitions**:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
```

**Permanent Animations** (Cards that always move):
```tsx
<motion.div
  animate={{ 
    y: [0, -10, 0],
    rotateZ: [0, 1, -1, 0]
  }}
  transition={{ 
    duration: 4, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }}
>
```

---

## 🔧 Technical Rules

### 1. File Organization

```
/components/
  /doodle/          → Reusable doodle-styled components
  /booking/         → Booking flow steps
  /admin/           → Admin panel pages
  /ui/              → Shadcn UI components (DO NOT MODIFY DIRECTLY)
  
  HomePage.tsx      → Landing page
  GuestDashboard.tsx → Post-booking dashboard
  Navigation.tsx    → Main nav menu
```

**Keep files small**:
- Extract helper functions to separate files
- Create sub-components for complex logic
- Maximum ~300 lines per component

### 2. Image Handling

**Figma Assets** (raster images):
```tsx
import img from "figma:asset/abc123.png";  // ✅ Correct
import img from "./imports/figma:asset/abc123.png";  // ❌ Wrong
```

**SVG Icons**:
```tsx
import svgPaths from "./imports/svg-wg56ef214f";  // ✅ Relative path
```

**New Images** (use ImageWithFallback):
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="https://..." 
  alt="Description"
  className="..."
/>
```

**Stock Photos** (use unsplash_tool):
- Never hardcode image URLs
- Use 2-3 keyword queries
- Relevant to content (pilgrims, hiking, Camino, Spain, hostels)

### 3. Icon Library

**Lucide React** (verify before using):
```tsx
import { Home, Calendar, Users, Settings } from 'lucide-react';

// ⚠️ MUST verify icon exists in lucide-react exports
// Check: node_modules/lucide-react/dist/esm/icons/index.js
```

### 4. Environment Variables

```tsx
// .env file
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

// Usage in code
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

**Security**:
- `.env` files MUST be in `.gitignore`
- Never commit API keys
- Use placeholders for demo purposes

### 5. Library Versions

**Specific versions required**:
```tsx
import { useForm } from 'react-hook-form@7.55.0';
import { toast } from 'sonner@2.0.3';
```

**Standard imports** (no version):
```tsx
import { motion } from 'motion/react';
import { LineChart } from 'recharts';
```

---

## 🚀 Performance & UX

### Scrolling Philosophy

**Prefer**:
- ✅ Parallax effects
- ✅ 3D transforms
- ✅ Horizontal carousels
- ✅ Expandable sections
- ✅ Tabbed interfaces

**Avoid**:
- ❌ Long vertical scrolling pages
- ❌ Infinite scroll
- ❌ Small scroll areas

### Loading States

Always provide feedback:
```tsx
{isLoading && <p className="hand-drawn text-gray-500">Loading...</p>}
```

### Error Handling

Use toast notifications:
```tsx
import { toast } from 'sonner@2.0.3';

toast.success('Booking confirmed!');
toast.error('Something went wrong');
```

---

## 📊 Admin Panel Specifics

### Color Scheme

- **Sidebar**: Dark green (#006b24)
- **Active items**: Bright green (#00AB39)
- **Content area**: Light grey (#F5F5F5)

### Data Visualization

**Charts** (use Recharts):
```tsx
import { LineChart, BarChart, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <Line stroke="#00AB39" />
  </LineChart>
</ResponsiveContainer>
```

**Tables**:
- Zebra striping (alternate row colors)
- Hover states
- Internal horizontal scroll for wide tables
- Actions column on the right

### Status Indicators

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-[#00AB39] border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-[#EAC102] border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-[#ED1C24] border-red-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
```

---

## ✅ Pre-Flight Checklist

Before marking any page complete:

- [ ] No horizontal scrolling at any screen size (320px - 1920px)
- [ ] All animations are smooth (60fps target)
- [ ] Doodle styling consistent (hand-drawn borders, shadows)
- [ ] Color palette strictly followed (greens, greys, black, white only)
- [ ] Typography uses correct font families
- [ ] No hardcoded font-size or font-weight classes (unless requested)
- [ ] Responsive breakpoints tested (mobile, tablet, desktop)
- [ ] Images use proper import methods (figma:asset or ImageWithFallback)
- [ ] Icons verified in lucide-react
- [ ] Loading states implemented
- [ ] Error handling with toast notifications
- [ ] Micro animations on interactive elements
- [ ] 3D effects where appropriate (shadows, transforms)

---

## 🎨 Inspiration & Style References

**Design Systems**:
- **DoodleCSS**: Hand-drawn, sketchy, organic shapes
- **Wired.js**: Wire-frame style UI elements
- **Modern 3D Web**: Shadows, depth, layering, parallax

**Mood**:
- Warm and welcoming (pilgrim hospitality)
- Playful but professional
- Hand-crafted feel (Camino authenticity)
- Modern functionality (clean booking flow)

---

## 📝 Notes for AI Assistants

1. **Always check existing doodle components** before creating new ones
2. **Never break the color palette** - if you need a new color, confirm first
3. **Overflow-x-hidden is CRITICAL** - add to every page container
4. **Animations should be delightful, not distracting** - 2-4 second loops
5. **Mobile-first responsive** - design for 375px width first
6. **Test table overflow** - large data tables need internal scroll
7. **Sidebar layouts** - always use flex-shrink-0 on fixed-width sidebars
8. **Performance matters** - avoid heavy re-renders in booking flow

---

## 🔗 Quick Reference Links

- **Color Palette**: See `/styles/globals.css` → `:root` variables
- **Doodle Classes**: See `/styles/globals.css` → `@layer utilities`
- **Typography**: See `/styles/globals.css` → `@layer base`
- **Components**: Browse `/components/doodle/` directory
- **Booking Flow**: `/components/NewBookingFlow.tsx`
- **Admin Panel**: `/components/admin/AdminLayout.tsx`

---

**Last Updated**: December 2024  
**Project Status**: Active Development  
**Design System Version**: 1.0
