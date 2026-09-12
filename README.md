# Albergue Municipal Carrascalejo

![Albergue Municipal Carrascalejo Logo](./frontend/public/favicon.svg)

Pilgrim Management System & Booking Platform for the Camino de Santiago (Vía de la Plata)

[![Astro](https://img.shields.io/badge/Astro-7.3.2-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Hono](https://img.shields.io/badge/Hono-4.13-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Node.js](https://img.shields.io/badge/Node.js->=22.12.0-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F740?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team)

[Overview](#overview) • [Features](#features) • [Architecture](#architecture) • [Getting started](#getting-started) • [Available scripts](#available-scripts) • [Deployment](#deployment) • [Project structure](#project-structure)

---

## Overview

**Albergue Municipal Carrascalejo** is a modern monorepo application built to streamline operations and reservation workflows for the municipal pilgrim hostel in Carrascalejo, a key resting point along the historic **Vía de la Plata** route of the **Camino de Santiago**.

The application combines a lightweight, hand-drawn design system for pilgrims with a resilient API and compliance engine that automates check-ins, bed allocations, encrypted identity verification, and mandatory government traveller submissions (Guardia Civil / Hospederías XML reports).

> [!NOTE]
> The frontend UI incorporates custom hand-drawn canvas components via **RoughJS** and **webcoreui**, creating a warm, organic experience designed for pilgrims on desktop and mobile devices.

---

## Features

- **Bed Booking & Reservation**: Real-time bed availability tracking (€10/night across 24 beds), automated expiration timers for pending reservations, and multi-language support (ES, EN, EU, KO, ID, PT, AR).
- **Pilgrim Identity Protection**: End-to-end PII data protection with encrypted personal storage (passport/national ID numbers, birth dates, phone numbers, and addresses) in compliance with GDPR data retention policies.
- **Hospitalero Management Dashboard**: Real-time room assignment, bed status monitoring, maintenance notes, and payment status verification.
- **Automated Law Enforcement Compliance**: Automatic XML document generation and transmission for Spanish police traveller logs (*partes de hospederías* / Guardia Civil).
- **CQRS Backend Architecture**: Built with Hono and Drizzle ORM using strict Command/Query separation, rate limiting (100 req/min per IP), circuit breakers, and health diagnostics.
- **Multi-Cloud Target Support**: Front-end deployment configured for Cloudflare Workers/Pages (default via Wrangler), Netlify, or Stormkit.

---

## Architecture

This project is structured as a **pnpm workspace monorepo**:

```bash
.
├── packages/
│   ├── frontend/        # Astro 7 frontend web application
│   ├── backend/         # Hono API server (CQRS pattern)
│   └── domain_model/    # Shared Drizzle schemas & Zod models (@albergue/domain-model)
```

### Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Astro 7.3, RoughJS, webcoreui, UnoCSS, Swup, Nanostores, Playwright, Vitest |
| **Backend** | Hono 4.13, Node.js (`@hono/node-server`), Drizzle ORM, Zod, Vitest |
| **Domain & Data** | PostgreSQL, Drizzle ORM schemas, Drizzle-Zod validation models, SQL migrations |
| **Deployment** | Cloudflare Workers / Pages, Netlify, Stormkit |

---

## Getting started

### Prerequisites

Ensure you have the following installed on your local development machine:

- **Node.js**: `^22.12.0` (frontend requires `>=22.12.0`, backend `>=18.0.0`)
- **pnpm**: `>=10.0.0`
- **PostgreSQL**: Local instance or remote database connection (e.g. Neon, Supabase)

### Local Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/guillermolam/albergue.git
   cd albergue
   ```

2. **Install workspace dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in `packages/backend/` and `packages/frontend/` based on required variables:

   ```bash
   # Backend (packages/backend/.env)
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/albergue_dev
   NODE_ENV=development

   # Frontend (packages/frontend/.env)
   PUBLIC_APP_URL=http://localhost:4321
   ```

4. **Start local development servers:**

   Run both frontend and backend concurrently:

   ```bash
   pnpm dev:all
   ```

   Or start components individually:

   ```bash
   # Start frontend (http://localhost:4321)
   pnpm dev

   # Start backend API (http://localhost:3001)
   pnpm dev:backend
   ```

> [!TIP]
> You can also use [go-task](https://taskfile.dev) if installed locally by running `task dev` to start the development workflow.

---

## Available scripts

All scripts are defined at the root workspace level and can be executed via `pnpm`:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Astro frontend dev server (`localhost:4321`) |
| `pnpm dev:backend` | Starts the Hono backend API dev server (`localhost:3001`) |
| `pnpm dev:all` | Runs frontend and backend dev servers in parallel |
| `pnpm build` | Builds the frontend for Cloudflare Pages (default) |
| `pnpm build:all` | Builds all packages (`domain_model`, `backend`, `frontend`) |
| `pnpm type-check` | Runs TypeScript type checking across all workspace packages |
| `pnpm test` | Runs unit tests for the backend package via Vitest |

### Frontend-specific commands

From the `packages/frontend` directory or using `--filter albergue-carrascalejo-frontend`:

```bash
# Build targets
pnpm --filter albergue-carrascalejo-frontend build:cloudflare  # Cloudflare Workers/Pages
pnpm --filter albergue-carrascalejo-frontend build:netlify     # Netlify
pnpm --filter albergue-carrascalejo-frontend build:stormkit    # Stormkit

# Code quality & testing
pnpm --filter albergue-carrascalejo-frontend format            # Format code with Prettier
pnpm --filter albergue-carrascalejo-frontend check:astro       # Run Astro diagnostic checks
pnpm --filter albergue-carrascalejo-frontend e2e               # Run Playwright E2E tests
```

---

## Deployment

The frontend deployment adapter is selected automatically via environment or target flags using the deploy script (`scripts/deploy.mjs`).

### Deploying Frontend

```bash
# Cloudflare Pages / Workers (default)
pnpm --filter albergue-carrascalejo-frontend deploy:cloudflare

# Netlify
pnpm --filter albergue-carrascalejo-frontend deploy:netlify

# Stormkit
pnpm --filter albergue-carrascalejo-frontend deploy:stormkit
```

> [!IMPORTANT]
> Ensure `PUBLIC_APP_URL` is configured in your production deployment environment to ensure correct absolute URLs for emails and sitemap generation.

### Deploying Backend

The backend is built with Hono and can be deployed as a standard Node.js server via `node dist/index.js` or exported to serverless environments such as Cloudflare Workers.

---

## Project structure

```bash
.
├── AGENTS.md                   # Workspace agent and coding guidelines
├── Taskfile.yml                # Task runner configuration
├── pnpm-workspace.yaml         # pnpm monorepo workspace definition
├── package.json                # Root package configurations & workspace scripts
└── packages/
    ├── backend/
    │   ├── src/
    │   │   ├── commands/      # CQRS command handlers (beds, payments, pricing)
    │   │   ├── queries/       # CQRS query handlers (pilgrims, bookings, users)
    │   │   ├── routes/        # Hono REST API endpoints
    │   │   ├── lib/           # Database pools, error handling, rate limiters
    │   │   └── index.ts       # Backend entry point
    │   └── drizzle.config.ts  # Drizzle kit database migrations config
    ├── domain_model/
    │   ├── migrations/        # SQL migration files
    │   ├── schema.ts          # Drizzle ORM table definitions & Zod schemas
    │   └── seed/              # Development & test seed datasets
    └── frontend/
        ├── astro.config.*.mjs # Cloudflare, Netlify, Stormkit Astro configs
        ├── scripts/           # Deployment & locale build utility scripts
        ├── src/
        │   ├── components/    # UI components, RoughJS doodles, stats widgets
        │   ├── layouts/       # Main, Figma, and page layouts
        │   ├── locales/       # PO translation files for multi-language support
        │   ├── pages/         # Astro route pages (booking, admin, info)
        │   └── stores/        # Nanostores state management
        └── tests/             # Vitest unit tests & Playwright E2E specs
```
