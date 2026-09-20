# Smplrspace setup & calibration workflow

This is the manual, one-time setup required in the Smplrspace web Editor
before the viewer in this directory can show real geometry. None of this
can be done from code — Smplrspace's tracing/digitizing step is a GUI
workflow performed by a human against real floor-plan input (photos,
hand-drawn sketches, aerial/street imagery, and measurements).

**Nothing described here has been done yet.** No Smplrspace organization
or Spaces exist for this project. Do not paste Smplrspace's own demo
`spaceId` / `organizationId` / `clientToken` into this app at any point —
the app is designed to run without them (see `config.ts`) until real ones
exist.

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

Once Spaces exist, set these as real environment variables/secrets
(never commit them):

```
PUBLIC_SMPLR_ORGANIZATION_ID=<org id from step 1>
PUBLIC_SMPLR_CLIENT_TOKEN=<client token from step 1>
PUBLIC_SMPLR_SPACE_B01_ID=<B01 space id from step 2>
PUBLIC_SMPLR_SPACE_B02_ID=<B02 space id from step 2>
PUBLIC_SMPLR_SPACE_B03_ID=<B03 space id from step 2>
```

These are declared as optional client env vars in
`astro.config.shared.mjs`. As soon as all of them are set for a given
building, `getSmplrConfig()` in `config.ts` starts returning a non-null
config and `SpaceViewer` switches from the "coming soon" placeholder to
actually mounting the Smplrspace viewer for that building — no code
change required.

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
