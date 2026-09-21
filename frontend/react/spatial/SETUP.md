# Smplrspace setup & calibration workflow

This is the manual, one-time setup required in the Smplrspace web Editor
before the viewer in this directory can show real geometry. None of this
can be done from code — Smplrspace's tracing/digitizing step is a GUI
workflow performed by a human against real floor-plan input (photos,
hand-drawn sketches, aerial/street imagery, and measurements).

**B01 is done; B02 and B03 are not.** The organization and B01's Space
(project `prj_l3kaqeh`) are real, and `frontend/scripts/root-env.mjs`
ships their organization id, client token, and B01 space id as committed
defaults — this is intentional, not an oversight (see that file's
comment for why: all three are `access: 'public'`, already inlined
verbatim into the client bundle regardless of whether they're committed).
B02 and B03 still need Steps 1–4 below (a B02/B03 Space in the _same_
organization, then wiring their ids into `root-env.mjs` and/or the
monorepo-root `.env`). Do not paste Smplrspace's own demo `spaceId` /
`organizationId` / `clientToken` into this app at any point.

## 0. Prerequisites

Gather the reconstruction input for each building before opening the
Editor: photographs, any hand-drawn floor plans, aerial/street imagery,
and known measurements. In particular, have B03's known ~67.50 m
perimeter on hand — it's the calibration reference in step 3.

## 1. Create the Smplrspace organization

1. Sign up / log in at Smplrspace and create the organization that will
   own this hostel's Spaces (a business/production org, not a personal
   trial — check Smplrspace's current plan options for what production
   use requires).
2. From the organization's dashboard, note the **Organization ID** and
   generate a **Client Token** scoped to it. These two values become
   `PUBLIC_SMPLR_ORGANIZATION_ID` and `PUBLIC_SMPLR_CLIENT_TOKEN`
   (see step 5).

## 2. Create three Spaces — one per building

Create three separate Spaces, not one combined Space — this matches the
domain model in `domain/types.ts`, where `BuildingCode` is `'B01' | 'B02'
| 'B03'` and each building holds its own `smplrSpaceId`.

| Building | What it is                                                                   | Approx. footprint                             |
| -------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| B03      | Warehouse (calibration building, do this first)                              | ~20.30 × 13.45 m, ~273 m², ~67.50 m perimeter |
| B01      | Accommodation (Staff Dorm, Toilets, Dorm 1, Dorm 2, Kitchen & Living, Patio) | ~16 × 14 m                                    |
| B02      | Social / Bar (Main hall, Kitchen, Terrace, WC)                               | —                                             |

In the Editor, for each building: create a new Space, name it clearly
(e.g. `Carrascalejo - B03 - Warehouse`), and upload the relevant photos /
sketches / aerial imagery as tracing reference.

## 3. Calibrate scale using B03 first

B03 is the calibration building because its perimeter is known with
reasonable confidence (~67.50 m). Do this before tracing B01 or B02:

1. In B03's Space, trace the building's outer walls against the
   reference imagery.
2. Use the Editor's measurement/scale tool to check the traced
   perimeter against the real ~67.50 m figure.
3. **If they disagree, adjust the trace/scale — do not adjust the known
   measurement to make the trace agree.** The 67.50 m figure is ground
   truth from a real measurement; the trace is the thing being
   calibrated against it. If there's a persistent, unexplained gap
   after re-checking the trace, stop and report the discrepancy rather
   than silently forcing a match.
4. Once B03's scale checks out, trace its interior rooms/walls.

## 4. Trace B01 and B02

With scale established from B03, trace B01 and B02 the same way, using
whatever reference imagery exists for each. For B01, trace all rooms
described in the physical site notes (Staff Dorm, Toilets, Dorm 1, Dorm
2, Kitchen & Living, Patio) — not just the two dormitories that are
currently bookable in the app's `beds` table. B01 has non-bookable
spaces too; the spatial model and the booking domain model are allowed
to disagree in scope (Smplrspace is physical truth, the app DB is
business truth — see `domain/types.ts`).

## 5. Wire the real IDs into the app

Once a building's Space exists, add its id (and the shared org id /
client token, if not already present) to `frontend/scripts/root-env.mjs`:

- The org id and client token are shared across all three buildings —
  add them once, in `SMPLR_B01_DEFAULTS` (rename if a second building
  besides B01 gets a committed default) or in the monorepo-root `.env`
  as `SMPLRSPACE_ORG_ID` / `SMPLRSPACE_API_TOKEN`.
- Each building's space id is per-building: add
  `SMPLRSPACE_SPACE_B02_ID`/`_B03_ID` to the monorepo-root `.env` (or a
  committed default in `root-env.mjs`, matching B01's, once that
  building's Space is real and stable).

These all resolve into `PUBLIC_SMPLR_ORGANIZATION_ID` /
`PUBLIC_SMPLR_CLIENT_TOKEN` / `PUBLIC_SMPLR_SPACE_B0{1,2,3}_ID`, declared
as client env vars in `astro.config.shared.mjs` (`access: 'public'` --
they're inlined verbatim into the client bundle regardless of whether
they're committed, so a GitHub Actions secret buys no more privacy than a
committed default; it only adds a dependency on that secret being set
correctly in whatever environment builds the app, which is exactly the
class of bug `root-env.mjs`'s committed B01 default exists to prevent).
As soon as a building's three values are all resolved, `getSmplrConfig()`
in `config.ts` starts returning a non-null config and `SpaceViewer`
switches from the "coming soon" placeholder to actually mounting the
Smplrspace viewer for that building — no other code change required.

## 6. After real Spaces exist: geometry-dependent work (not yet started)

Once B01/B02/B03 are real and calibrated, the next phase (intentionally
not built yet) is to use Smplrspace's `QueryClient` and picking mode to
_discover_ rooms, furniture/bunks, doors, and coordinates from the
traced Spaces — rather than duplicating that geometry by hand in this
app. That covers: an admin binding UI (`/admin/spatial`) to connect
Smplrspace furniture IDs to real `beds.id` rows via `SpatialBinding`,
render-mode support (transparent/cutaway/availability), and
availability-colored overlays. None of this can be usefully built or
tested without a real, traced Space to run it against.
