# ADR 0003: Client-side navigation — retain Swup, re-evaluate against Phase 9 budgets

- Status: accepted (interim), re-evaluation mandated in Phase 9
- Date: 2026-09-12
- Context: ASTRO-006

## Context

The frontend ships `@swup/astro` with `globalInstance: true`, fade theme,
`#main-content` container swapping, cache, hover/visible preload, the a11y
plugin, form handling, and `reloadScripts: true`. Astro 7 also offers native
alternatives that did not exist (stable) when Swup was adopted.

Options compared:

| Option                          | JS cost          | a11y (focus/announce) | History/scroll | Notes                                                                           |
| ------------------------------- | ---------------- | --------------------- | -------------- | ------------------------------------------------------------------------------- |
| Swup (current)                  | ~10 kB + plugins | plugin-managed        | plugin-managed | global instance; script re-execution via `reloadScripts` is a known fragility   |
| Plain MPA + `prefetch`          | 0 kB             | browser-native        | browser-native | loses cross-page transitions; prefetch already enabled                          |
| Cross-document View Transitions | ~0 kB (native)   | browser-native        | browser-native | Chrome/Edge/Safari 18+; Firefox pending — acceptable as progressive enhancement |
| `ClientRouter`                  | ~3 kB            | built-in              | built-in       | Astro-native; per-page opt-in; closest maintained analogue to Swup              |

## Decision

Retain Swup until Phase 9 (PERF-*) measures it. Then re-run this comparison
with field data and either justify Swup or migrate to `ClientRouter` with
native View Transitions as progressive enhancement.

Measurement plan (Phase 9 exit criteria):

- JS cost: bundle diff of Swup + plugins vs `ClientRouter` baseline.
- Navigation latency: p75 click-to-content-visible on the 5 hottest routes.
- Accessibility: focus target, announcement, and reduced-motion behaviour
  verified in the Playwright journey suite (Phase 10).
- History/scroll: restoration correctness across back/forward on swapped
  containers.

## Consequences

- No new Swup plugins without a budget check.
- `reloadScripts: true` stays flagged as a defect risk; islands must remain
  idempotent under re-execution until the migration decision lands.
- The session/Actions scaffold (ASTRO-002/003) is navigation-agnostic and
  unaffected by this decision.
