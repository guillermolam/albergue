# Plan: Replace Language Selector with Figma Design

## Goal
Replace the current simple SVG-based language switcher in `Navigation.tsx` with the Figma-style `LanguageSelector` component that features:
- Doodle-style double border background with hover animations
- Globe icon from lucide-react
- Language name in "Patrick Hand" font
- Animated arrow indicator
- Floating particle animation
- Dropdown menu with flag emojis, animated active indicator, and check marks

## Current State
- `Navigation.tsx` (lines 446-486): Custom SVG button showing "ES"/"EN" text
- `figma/src/app/components/LanguageSelector.tsx`: Full Figma implementation using figma's `useI18n` context
- Frontend uses `useI18n` from `./hooks/useI18n.ts` returning `{ locale, setLocale, t }`

## Required Changes

### 1. Create Frontend-Compatible LanguageSelector Component
**Location**: `frontend/react/ui/LanguageSelector.tsx` (new file)

Adapt the figma component to:
- Use frontend `useI18n` hook (`locale`/`setLocale` instead of `language`/`setLanguage`)
- Import `Globe` from `lucide-react` (already available)
- Keep all motion/react animations and styling
- Export as named export `LanguageSelector`

### 2. Update Navigation.tsx
**Location**: `frontend/react/Navigation.tsx`

- Import `LanguageSelector` from `./ui/LanguageSelector`
- Replace lines 446-486 (current language switcher button) with `<LanguageSelector />`
- Remove the `t.switchLang`, `t.langCode`, and related NAV_COPY entries if no longer needed
- Keep the mobile menu language handling if separate

### 3. Verify Styling Dependencies
- Ensure `motion/react` (Framer Motion) is available - already used in Navigation
- Ensure `lucide-react` is available - already used in Navigation
- Font "Patrick Hand" should be loaded globally (check if already in layout)

## Implementation Details

### LanguageSelector Props (optional)
The component can be self-contained using `useI18n()` internally, no props needed.

### Dropdown Positioning
The figma version uses `absolute top-full right-0 mt-2` - verify this works within Navigation's flex container. May need `relative` on parent.

### Mobile Considerations
The figma dropdown is desktop-oriented. Consider:
- Keep current mobile menu language toggle (lines 566-574 in Navigation.tsx) OR
- Make LanguageSelector responsive

## Testing
- Verify language switching works (locale changes, persists)
- Check animations render correctly (hover, dropdown open/close)
- Verify no hydration mismatches (deterministic animations)
- Test on mobile viewport

## Out of Scope
- Adding new languages beyond EN/ES
- Changing i18n store implementation
- Modifying other pages' language handling