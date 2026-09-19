# Component Architecture Enhancement Plan

## Context

The albergue frontend (`frontend/`) is an Astro 7.3.2 project with `output: 'server'` (SSR enabled). It has 18 pages, 5 layouts, 1 island, 5 React island components, and 8 nanostores. Most pages are statically prerendered; a few use dynamic rendering. The goal is to identify which components need additional nested islands, layouts, components, nanostores, and SSR enablement to improve interactivity, maintainability, and performance.

## Current State Summary

| Aspect | Current |
|--------|---------|
| SSR | Enabled (`output: 'server'`) |
| Pages | 18 (10 prerender=true, 8 prerender=false) |
| Islands | 1 Astro island (`LanguageSelectorIsland.astro`) |
| React islands | 5 (`HomePage`, `BookingFlow`, `Dashboard`, `BookingsTable`, `BedManagement`) |
| Layouts | 5 (`Layout`, `FigmaLayout`, `BaseLayout`, `LandingLayout`, `AdminLayout`) |
| Nanostores | 8 (`currentUser`, `userPreferences`, `bookingCart`, `i18nStore`, `dailyGoalKm`, `currentStageProgress`, `isBusy`, `lastError`) |
| Middleware | 5 chained (`request-id`, `security`, `locale`, `auth`, `mock-api`) |

---

## 1. Nested Islands (add interactive islands to static pages)

### Priority: High

### `dashboard.astro` (prerender=true, static)
- **Add island**: `UserProfileCard.astro` — displays pilgrim name, email, profile picture; editable via `client:load` React
- **Add island**: `DashboardBookingWidget.astro` — shows next/current booking with check-in/check-out actions; uses `backendJson` for live data
- **Add island**: `CaminoProgressTracker.astro` — shows today's km, daily goal, progress bar; interactive via React

### `camino.astro` (prerender=true, static, 310 lines)
- **Add island**: `CaminoStageProgress.astro` — interactive stage tracker with current location, distance to next stage, estimated arrival
- **Add island**: `DailyKmLogger.astro` — input form for logging daily km with `actions` or `backendJson` submission

### `booking-confirmed.astro` (prerender=false, SSR)
- **Add island**: `BookingShareActions.astro` — print, email, copy link actions for confirmed booking
- **Add island**: `RelatedBookings.astro` — shows other bookings for same pilgrim

### `info.astro` (prerender=true, static)
- **Add island**: `FAQAccordion.astro` — searchable/filterable FAQ accordion (currently static `<details>` elements)
- **Add island**: `ContactForm.astro` — contact form with validation using `actions`

### `admin/services.astro` (prerender=false, server-rendered)
- **Replace inline JS dropdown** with `ServiceDropdown.astro` island — proper accessible dropdown menu
- **Add island**: `ServiceRefreshButton.astro` — refresh individual service status without full page reload

### `admin/services-realtime.astro` (prerender=false)
- **Convert `ServiceStatus` Astro component** to `ServiceStatusIsland.astro` — enable real-time polling/updates via React or setInterval in island

### `camino-dashboard.astro` (prerender=true, uses `BaseLayout`)
- **Add island**: `StageList.astro` — interactive list of stages with completion toggle

---

## 2. Additional Layouts

### Priority: Medium

### `BookingFlowLayout.astro` (NEW — in `src/layouts/`)
- Purpose: Dedicated layout for the multi-step booking wizard (`book.astro`)
- Content: Minimal header (brand + language selector), no main nav/footer, step indicator bar at top
- Why: `book.astro` currently uses `Layout.astro` with `showHeader=false, showFooter=false` — a dedicated layout makes the flow consistent and maintainable
- Includes: Progress step indicator derived from `booking-draft.ts` step state

### `AuthLayout.astro` (NEW — in `src/layouts/`)
- Purpose: Centered, minimal layout for authentication pages (`auth.astro`)
- Content: Centered card container, brand logo, no nav/footer
- Why: Auth pages need a clean, focused layout different from the main layout

---

## 3. Additional Components

### Priority: High

### `src/components/ErrorBoundary.tsx` (NEW — React)
- React error boundary component wrapping island components
- Catches render errors, shows fallback UI with retry button
- Used in pages that contain multiple islands

### `src/components/SkeletonLoader.tsx` (NEW — Astro/React)
- Skeleton/loading placeholders for island content while data loads
- Variants: card, table, stats, text

### `src/components/ToastNotification.tsx` (NEW — React island)
- Toast/notification display component using `notifications` nanostore (see §4)
- Auto-dismiss, stacking, success/error/info/warning variants

### `src/components/StepIndicator.astro` (NEW — Astro island)
- Visual step progress indicator for multi-step wizards (booking, etc.)
- Props: `steps`, `currentStep`, `onStepClick`

### `src/components/BookingFormFields.astro` (NEW — Astro/React)
- Reusable form field components for booking flow (date picker, guest selector, bed selector)
- Shared between `BookingFlow.tsx` and any future booking pages

### `src/components/DataTable.astro` (NEW — Astro island)
- Generic data table with sorting, filtering, pagination
- Reusable for admin pages (bookings, beds, pilgrims)

---

## 4. Additional Nanostores

### Priority: High

### `src/stores/uiState.ts` (NEW)
- Manages global UI state shared across islands
- State: `activeModal`, `drawerOpen`, `sidebarCollapsed`, `theme`
- Use: Any island that needs to open/close modals or toggle UI elements
- Persistence: session-only (no `@nanostores/persistent`)

### `src/stores/notifications.ts` (NEW)
- Toast/notification system state
- State: `notifications: Array<{id, type, message, duration}>`
- Actions: `showToast(message, type)`, `dismissToast(id)`, `clearAll()`
- Use: `ToastNotification` component + any island that needs to show feedback

### `src/stores/searchState.ts` (NEW)
- Shared search/filter state across islands
- State: `searchTerm`, `filters`, `sortBy`, `sortDir`, `page`
- Use: Admin tables, booking search, camino stage search

### `src/stores/formState.ts` (NEW)
- Form validation state for booking and other multi-step forms
- State: `errors: Record<string, string[]>`, `touched: Record<string, boolean>`, `isValid: boolean`
- Actions: `setFieldError(field, error)`, `clearFieldError(field)`, `validateAll()`
- Use: `BookingFlow` steps, `ContactForm` island

---

## 5. SSR Enablement

### Priority: Medium

### Pages to switch from `prerender: true` → `prerender: false` (enable dynamic SSR)

| Page | Current | Reason |
|------|---------|--------|
| `dashboard.astro` | prerender=true | Shows user-specific data (bookings, pilgrim info); should be SSR per request |
| `camino.astro` | prerender=true | Could show personalized content (logged-in pilgrim progress); switch to dynamic |
| `camino-dashboard.astro` | prerender=true | If showing user-specific camino data, switch to dynamic |

### Components needing `server:defer` for streaming SSR

| Component | Page | Reason |
|-----------|------|--------|
| Dashboard widgets | `dashboard.astro` | Booking widget, profile card can load independently |
| Camino stage tracker | `camino.astro` | Stage progress can stream while static content renders first |
| Booking confirmation details | `booking-confirmed.astro` | Heavy booking data can defer while shell renders |

### Pages already correctly dynamic (no change needed)
- `booking.astro`, `admin/*`, `booking-confirmed.astro`, `auth.astro`, `demo-user-profile.astro` — all `prerender=false`

---

## 6. Implementation Order

### Phase 1 — Foundation (do first)
1. Create `uiState.ts` and `notifications.ts` nanostores
2. Create `ToastNotification.tsx` component using notifications store
3. Create `ErrorBoundary.tsx` React component
4. Create `AuthLayout.astro` and `BookingFlowLayout.astro`
5. Switch `auth.astro` to `AuthLayout`, `book.astro` to `BookingFlowLayout`

### Phase 2 — High-impact islands
6. Create `UserProfileCard.astro` island for dashboard
7. Create `CaminoStageProgress.astro` island for camino pages
8. Create `ServiceStatusIsland.astro` (convert existing ServiceStatus component)
9. Create `FAQAccordion.astro` island for info page
10. Add `notifications` store integration to `Dashboard`, `BookingsTable`, `BedManagement`

### Phase 3 — Remaining islands and components
11. Create `DashboardBookingWidget.astro`, `CaminoProgressTracker.astro` for dashboard
12. Create `DailyKmLogger.astro`, `BookingShareActions.astro`, `ContactForm.astro`
13. Create `SkeletonLoader.tsx`, `StepIndicator.astro`, `DataTable.astro`
14. Create `searchState.ts` and `formState.ts` nanostores

### Phase 4 — SSR enablement
15. Switch `dashboard.astro`, `camino.astro` to `prerender=false`
16. Add `server:defer` to dashboard widgets, booking confirmation
17. Verify middleware still works for newly dynamic pages (auth check in `authMiddleware`)

---

## 7. Validation

- [x] All new islands compile without TypeScript errors (`pnpm typecheck`)
- [x] All new nanostores have exported types and action signatures
- [x] All new layouts render correctly on public, admin, and booking pages
- [ ] Switched pages (dashboard, camino) still pass auth middleware checks
- [ ] No regression in Lighthouse scores after adding islands
- [x] `pnpm build` completes successfully with all changes
- [ ] Playwright E2E tests pass for booking flow, admin dashboard, auth flow
