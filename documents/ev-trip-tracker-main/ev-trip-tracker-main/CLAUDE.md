# EV Trip Tracker — CLAUDE.md

## Project Overview

A mobile-first Tesla charging tracker for a ~5,000 km road trip:
**Istanbul → Sofia → Belgrade → Pécs → Zagreb → Ljubljana → Trieste → Izola → Zagreb → Istanbul**

Users log each charging stop with full session details. Phase 2 adds a map view of the route.

---

## Tech Stack

| Layer      | Choice                        | Notes                                      |
|------------|-------------------------------|--------------------------------------------|
| Framework  | Next.js 15 (App Router)       | TypeScript, deployed to Vercel             |
| Database   | Supabase (PostgreSQL)         | Hosted Postgres + auto-generated REST API  |
| Styling    | Tailwind CSS v4               | Mobile-first, dark mode ready              |
| Map (P2)   | Leaflet + react-leaflet       | Planned; not in initial build              |
| Deployment | Vercel                        | Auto-deploy from `main` branch             |

---

## Repository Structure

```
ev-trip-tracker/
├── CLAUDE.md
├── .env.local.example          # Copy to .env.local and fill in
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, providers)
│   │   ├── page.tsx            # Home — charge session list
│   │   ├── add/
│   │   │   └── page.tsx        # Add new charge session
│   │   ├── edit/[id]/
│   │   │   └── page.tsx        # Edit existing session
│   │   └── api/
│   │       └── charges/
│   │           └── route.ts    # REST handlers (GET, POST, PATCH, DELETE)
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable primitives (Button, Input, Card…)
│   │   ├── ChargeForm.tsx      # Shared add/edit form
│   │   ├── ChargeCard.tsx      # Single session card for list view
│   │   ├── ChargeList.tsx      # Full session list with summary stats
│   │   └── StatsBar.tsx        # Trip totals (kWh, cost, time, distance)
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client (browser + server)
│   │   └── utils.ts            # Currency formatting, duration helpers, etc.
│   │
│   ├── hooks/
│   │   └── useCharges.ts       # Data-fetching hooks
│   │
│   └── types/
│       └── index.ts            # Shared TypeScript types
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql     # charges table + indexes
│   └── seed.sql                # Optional: sample data for dev
│
└── public/
    └── favicon.ico
```

---

## Database Schema

### `charges` table

| Column                       | Type           | Notes                                      |
|------------------------------|----------------|--------------------------------------------|
| `id`                         | UUID PK        | Auto-generated                             |
| `created_at`                 | timestamptz    | Auto                                       |
| **Location**                 |                |                                            |
| `location_name`              | text NOT NULL  | e.g. "Sofia Tesla Supercharger"            |
| `city`                       | text NOT NULL  | e.g. "Sofia"                               |
| `country`                    | text NOT NULL  | e.g. "Bulgaria"                            |
| `charger_network`            | text           | e.g. "Tesla Supercharger", "Ionity"        |
| `connector_type`             | text           | e.g. "CCS2", "Tesla"                       |
| `plugshare_url`              | text           | Full URL to PlugShare listing              |
| `latitude`                   | numeric(10,7)  | For Phase 2 map view                       |
| `longitude`                  | numeric(10,7)  | For Phase 2 map view                       |
| **Session timing**           |                |                                            |
| `session_date`               | date NOT NULL  |                                            |
| `arrival_time`               | timestamptz    |                                            |
| `departure_time`             | timestamptz    |                                            |
| `duration_minutes`           | integer        | Can be derived or manually entered         |
| **Battery**                  |                |                                            |
| `battery_pct_arrival`        | integer        | 0–100                                      |
| `battery_pct_departure`      | integer        | 0–100                                      |
| **Energy**                   |                |                                            |
| `kwh_charged`                | numeric(6,2)   | Total kWh added                            |
| `avg_charging_speed_kw`      | numeric(6,1)   | Average kW during session                  |
| `peak_charging_speed_kw`     | numeric(6,1)   | Peak kW                                    |
| **Cost**                     |                |                                            |
| `cost_amount`                | numeric(10,2)  | Total cost in original currency            |
| `cost_currency`              | text           | ISO 4217: "EUR", "TRY", "HUF", "RSD"…    |
| `cost_per_kwh`               | numeric(6,4)   | Rate per kWh in original currency          |
| **Trip context**             |                |                                            |
| `odometer_km`                | integer        | Odometer reading at arrival                |
| `distance_since_last_charge` | integer        | km driven since previous charge            |
| `temperature_celsius`        | integer        | Ambient temp (affects range)               |
| **Notes**                    |                |                                            |
| `notes`                      | text           | Free-text observations                     |

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Set the same variables in Vercel → Project Settings → Environment Variables.

---

## Key Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev               # http://localhost:3000

# Type-check
npm run type-check

# Build for production
npm run build

# Supabase local dev (optional)
npx supabase start
npx supabase db push      # Apply migrations
npx supabase db reset     # Reset + re-seed
```

---

## Trip Route & Countries

The app must handle these currencies natively:

| Leg                        | Country  | Currency |
|----------------------------|----------|----------|
| Istanbul → Sofia           | TR → BG  | TRY, BGN |
| Sofia → Belgrade           | BG → RS  | BGN, RSD |
| Belgrade → Pécs            | RS → HU  | RSD, HUF |
| Pécs → Zagreb              | HU → HR  | HUF, EUR |
| Zagreb → Ljubljana         | HR → SI  | EUR      |
| Ljubljana → Trieste/Izola  | SI → IT  | EUR      |
| Return via Zagreb          | IT → HR  | EUR      |

Always store `cost_currency` alongside `cost_amount` — never convert at write time.

---

## Coding Conventions

- **TypeScript strict mode** — no `any`
- **Server Components by default**; add `'use client'` only when needed (forms, hooks)
- **Tailwind only** for styling — no inline styles, no CSS modules
- **Named exports** for components; default export only for Next.js pages/layouts
- **Supabase calls in `src/lib/supabase.ts`** — never call Supabase directly from components
- Keep API route handlers thin; business logic in `src/lib/`

---

## Roadmap

### Phase 1 — Core tracker ✅
- [x] Charge session list (home page)
- [x] Add / Edit / Delete session form
- [x] Trip stats bar (total kWh, cost per country, time charging)
- [x] Mobile-optimised layout from imported UI design

### Phase 2 — Map view ✅
- [x] Leaflet map showing route with charging stop markers
- [x] Click marker → session detail popover
- [x] Coordinates captured at add time (geolocation button + manual lat/lng)

### Phase 3 — Nice-to-haves
- [x] Currency conversion summary (all costs in EUR equivalent)
- [x] Efficiency chart (Wh/km per leg) — `EfficiencyChart`, on the Stats screen
- [x] Export to CSV + Excel (`src/lib/export.ts`, `ExportCard`; xlsx lazy-loaded)

### Distance / efficiency model
Leg distance is derived from the **odometer** logged at each stop
(`distance = odometer(N) − odometer(N−1)`), with the trip-start odometer
(Settings → Trip start) as the baseline for the first leg. A manual
"distance since last" entry is the fallback when no odometer is recorded.

Efficiency is measured from the **battery drop while driving**, not the kWh
added at the stop (a free top-up to 100% would otherwise inflate it):
`consumed kWh = (previous departure % − this arrival %) × usable capacity`, then
`Wh/km = consumed ÷ leg distance`. Usable pack capacity is set in Settings →
Battery, or auto-estimated from the log (`kWh added ÷ % gained`, median). When
battery %s or capacity are missing it falls back to `kWh added ÷ distance`.
Logic lives in `src/lib/charges.ts` (`computeLegMetrics`,
`estimateUsableCapacity`); on-device trip + rate settings live in
`src/lib/trip.ts` and `src/lib/rates.ts`.

> Note: a few inline `style` values remain where Tailwind can't express a
> runtime value (computed percentages, dynamic colors, Leaflet markers).
