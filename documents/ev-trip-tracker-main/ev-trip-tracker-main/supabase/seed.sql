-- Optional seed data for local development
-- Run: npx supabase db reset  (applies migrations + this seed)

INSERT INTO charges (
  location_name, city, country, charger_network, connector_type,
  session_date, duration_minutes,
  battery_pct_arrival, battery_pct_departure,
  kwh_charged, avg_charging_speed_kw, peak_charging_speed_kw,
  cost_amount, cost_currency, cost_per_kwh,
  odometer_km, distance_since_last_charge, temperature_celsius,
  notes
) VALUES (
  'Sofia Tesla Supercharger', 'Sofia', 'Bulgaria', 'Tesla Supercharger', 'Tesla',
  '2025-07-01', 38,
  12, 80,
  58.4, 110, 250,
  17.52, 'BGN', 0.30,
  1245, 560, 28,
  'First stop after Istanbul. Hot day, pre-conditioned battery.'
);
