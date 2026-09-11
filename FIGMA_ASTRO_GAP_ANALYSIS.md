# Figma Make ↔ Astro 7 — Gap Analysis real

**Albergue Carrascalejo** · 2026-09-11
Fuentes: Figma Make `nhtyfIO6mEsebEyAJtfjVB` (listado de código vía MCP) + `frontend/` del repo (leído en disco).

---

## Causa raíz

**No es drift de tokens. Son dos aplicaciones distintas.**

El Figma Make no es un fichero de diseño: es **una aplicación React funcionando**. El listado de código lo confirma — `src/app/App.tsx` como raíz, dos React Contexts (`AuthContext.tsx`, `I18nContext.tsx`), ~45 componentes **shadcn/ui** en `src/app/components/ui/`, Tailwind vía `postcss.config.mjs`, y seis capas CSS (`default_shadcn_theme.css`, `src/styles/{default_theme,fonts,globals,index,tailwind,theme}.css`).

Tu repo es **Astro 7 MPA**: UnoCSS `presetWind3`, 36 componentes `.astro`, `nanostores` en lugar de React Context, Swup para transiciones, RoughJS + Three.js, `output: 'server'`.

Por eso "no se comporta como en Figma": **el comportamiento del prototipo vive en estado React**. El flujo de reserva del Figma es una máquina de estados de seis pasos (`BookingStepper` orquestando `BedSelectionStep` → `DatePickerStep` → `PilgrimFormStep` → `IDUploadStep` → `PaymentStep` → `PriceSummaryModal`). En Astro **no existe ninguno de esos componentes**. Tienes `BookingConfirmation.astro` y un directorio `islands/booking/`: el final del flujo, no el flujo.

Y por eso "no se ve igual": los dos sistemas usan **namespaces de variables CSS disjuntos**. shadcn define `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--radius`. Tu `uno.config.ts` define `--green-light`, `--cream`, `--charcoal`, `--paper-bg`. Aunque los hex coincidieran, no hay contrato compartido — cada componente portado se reinterpreta a mano.

---

## Dos ficheros que debes abrir tú

El Figma Make contiene:

- `src/app/DOODLE_DESIGN_SYSTEM.md` — la especificación del sistema de diseño
- `src/app/MIGRATION_PLAN.md` — **un plan de migración ya escrito**

No pude leerlos: el MCP de Figma expone el código Make solo como *resource links*, y su lector de recursos acepta únicamente URIs `skill://`. Ábrelos en Figma Make y pégalos en los prompts de abajo. Son el input de mayor valor que existe para esta tarea y probablemente ya contienen decisiones que este documento está reconstruyendo a ciegas.

---

## Inventario de brechas (verificado por nombre de fichero)

### Ausente por completo en Astro

**Páginas** — HomePage, BookingPage, EmergenciesPage, RestaurantsPage, TourismPage, VisitsPage, GuestDashboard, CookiePolicy, LegalNotice, PrivacyPolicy, TermsAndConditions

**Chrome / navegación** — Navigation, Footer, LoginModal, UserProfileMenu, FloatingCostSummary

**Flujo de reserva — el núcleo del comportamiento** — NewBookingFlow, BookingForm, BookingStepper, BedSelectionStep, DatePickerStep, PilgrimFormStep, PilgrimCard, IDUploadStep, PaymentStep, PriceSummaryModal, AvailabilityGrid

**Primitivas doodle** — WiredButton, WiredCalendar, HandDrawnCalendar, DateTimePicker, AnimatedBackground, WritingEffect, DoodleBed, PhoneInput, AddressAutocomplete, IDUpload

**Showcases** — MeridaShowcase, LocalAreaShowcase, VisualAreaShowcase, IllustratedCard

### Parcial

**Admin** — Figma: AdminLayout, Dashboard, BedManagement, BookingsTable. Astro: `components/admin/`, `pages/admin/`, `CaminoDashboard.astro`. Hay que auditar qué cubre qué.

### Presente en ambos → verificar paridad, no reconstruir

DoodleBadge, DoodleCard, DoodleIcons, DoodlePattern, Hero, LanguageSelector, UserProfile(Menu), Input, Badge, Card, Button

### Capa shadcn (~45 componentes) — no portada

Muchas son puro estilo y tus shortcuts de UnoCSS ya las cubren (badge, card, separator, skeleton, label, aspect-ratio). **Estas tienen comportamiento real y son las que romperán**: dialog, drawer, sheet, select, tabs, accordion, calendar, table, form, popover, tooltip, command, carousel, input-otp, radio-group, checkbox, switch, slider, sonner (toasts), sidebar, pagination, navigation-menu, dropdown-menu, context-menu, hover-card, collapsible, progress, resizable, scroll-area, toggle-group.

Portarlas a Astro nativo significa reimplementar accesibilidad (focus trap, roles ARIA, navegación por teclado) que shadcn te daba gratis vía Radix. Es la partida de trabajo más grande y la más fácil de subestimar.

### Assets

El Figma Make trae **docenas de PNG con nombres hasheados** (`016baea5…png`, `02c8977b…png`, …). Tu `public/` tiene 17 entradas. Casi seguro faltan imágenes.

---

## Deuda propia del repo: duplicados sin canónico

Tu `src/components/` tiene **Button.astro ×3, Card.astro ×3, Hero.astro ×3**, más FeatureCard ×2, InfoBadge ×2, Stats ×2, SketchyButton ×2, DoodleCard ×2, Head ×2.

Esto por sí solo produce divergencia visual: distintas páginas importan distintas variantes del "mismo" componente. Hay que resolverlo **antes** de portar nada nuevo, o portarás sobre cimientos ambiguos.

---

## Orden de trabajo

El orden importa porque hay dependencias reales.

1. **Contrato de tokens.** Unificar el namespace de variables CSS. Todo lo demás se construye encima — hacerlo después significa retocar cada componente dos veces.
2. **Deduplicar componentes.** Elegir el canónico de Button/Card/Hero, borrar el resto, actualizar imports.
3. **Primitivas con comportamiento.** dialog, select, tabs, calendar, form — sin estas no se puede construir el flujo de reserva.
4. **Flujo de reserva.** Es el valor del producto y la mayor brecha funcional.
5. **Páginas y chrome.** Navigation, Footer, y las páginas de contenido.
6. **Assets y animaciones.** Lo último: es lo que menos bloquea.

---

## Comandos de verificación

Desde `frontend/`:

```
pnpm run check:astro     # astro check --tsconfig tsconfig.typecheck.json
pnpm run type-check      # tsc6 --noEmit
pnpm run build           # = build:cloudflare
pnpm run e2e             # playwright, chromium
pnpm dev                 # localhost:4321
```

Cualquier trabajo que no deje `check:astro` y `type-check` en verde no está terminado.

---

## Estado de este documento

Escrito a partir del **listado de ficheros** del Figma Make, no de su contenido. Sé qué componentes existen y qué stack usan; **no** sé sus valores de token, props, ni timings de animación. Las brechas de inventario son verificadas. Cualquier afirmación sobre valores concretos habría que confirmarla abriendo el Make o los dos `.md` citados arriba.
