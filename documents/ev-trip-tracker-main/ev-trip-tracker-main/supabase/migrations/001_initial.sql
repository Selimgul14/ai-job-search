-- EV Trip Tracker — initial schema
-- Apply via: npx supabase db push  (or paste into Supabase SQL editor)

CREATE TABLE IF NOT EXISTS charges (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Location
  location_name               TEXT NOT NULL,
  city                        TEXT NOT NULL,
  country                     TEXT NOT NULL,
  charger_network             TEXT,             -- "Tesla Supercharger", "Ionity", etc.
  connector_type              TEXT,             -- "CCS2", "Tesla", "Type 2", etc.
  plugshare_url               TEXT,
  latitude                    NUMERIC(10, 7),   -- Phase 2: map view
  longitude                   NUMERIC(10, 7),   -- Phase 2: map view

  -- Session timing
  session_date                DATE NOT NULL,
  arrival_time                TIMESTAMPTZ,
  departure_time              TIMESTAMPTZ,
  duration_minutes            INTEGER,          -- auto-derived if both times provided; else manual

  -- Battery state
  battery_pct_arrival         INTEGER CHECK (battery_pct_arrival BETWEEN 0 AND 100),
  battery_pct_departure       INTEGER CHECK (battery_pct_departure BETWEEN 0 AND 100),

  -- Energy
  kwh_charged                 NUMERIC(6, 2),
  avg_charging_speed_kw       NUMERIC(6, 1),
  peak_charging_speed_kw      NUMERIC(6, 1),

  -- Cost (always store in original currency — never convert at write time)
  cost_amount                 NUMERIC(10, 2),
  cost_currency               TEXT,             -- ISO 4217: "EUR", "TRY", "HUF", "RSD", "BGN"
  cost_per_kwh                NUMERIC(6, 4),

  -- Trip context
  odometer_km                 INTEGER,
  distance_since_last_charge  INTEGER,          -- km since previous charge stop
  temperature_celsius         INTEGER,

  -- Free text
  notes                       TEXT
);

-- Index for chronological listing (most common query)
CREATE INDEX IF NOT EXISTS idx_charges_session_date ON charges (session_date DESC);

-- Index for per-country cost summaries
CREATE INDEX IF NOT EXISTS idx_charges_country ON charges (country);

-- Enable Row Level Security (RLS) — open policy since this app has no auth
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON charges
  FOR ALL
  USING (true)
  WITH CHECK (true);
