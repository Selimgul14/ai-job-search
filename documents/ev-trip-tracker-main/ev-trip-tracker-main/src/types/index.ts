// Mirrors the `charges` table in Supabase exactly.
// Update this if the schema changes.

export interface ChargeSession {
  id: string;
  created_at: string;

  // Location
  location_name: string;
  city: string;
  country: string;
  charger_network: string | null;
  connector_type: string | null;
  plugshare_url: string | null;
  latitude: number | null;
  longitude: number | null;

  // Session timing
  session_date: string; // ISO date "YYYY-MM-DD"
  arrival_time: string | null; // ISO timestamptz
  departure_time: string | null;
  duration_minutes: number | null;

  // Battery
  battery_pct_arrival: number | null;
  battery_pct_departure: number | null;

  // Energy
  kwh_charged: number | null;
  avg_charging_speed_kw: number | null;
  peak_charging_speed_kw: number | null;

  // Cost
  cost_amount: number | null;
  cost_currency: string | null; // ISO 4217
  cost_per_kwh: number | null;

  // Trip context
  odometer_km: number | null;
  distance_since_last_charge: number | null;
  temperature_celsius: number | null;

  // Notes
  notes: string | null;
}

// Omit server-generated fields for create/update payloads
export type ChargeSessionInsert = Omit<ChargeSession, "id" | "created_at">;
export type ChargeSessionUpdate = Partial<ChargeSessionInsert>;

// Supported currencies on this trip route
export const TRIP_CURRENCIES = ["EUR", "TRY", "BGN", "RSD", "HUF"] as const;
export type TripCurrency = (typeof TRIP_CURRENCIES)[number];

// Countries on the route. `name` is stored in the DB `country` column;
// `code` drives flag + default-currency lookups in the UI.
export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string; // value stored in the DB
  flag: string; // emoji
  currency: TripCurrency; // default currency for charges here
}

export const COUNTRIES: Country[] = [
  { code: "TR", name: "Turkey", flag: "🇹🇷", currency: "TRY" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", currency: "BGN" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", currency: "RSD" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", currency: "HUF" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", currency: "EUR" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", currency: "EUR" },
  { code: "AT", name: "Austria", flag: "🇦🇹", currency: "EUR" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR" },
  { code: "GR", name: "Greece", flag: "🇬🇷", currency: "EUR" },
];

// Itinerary used for the route ribbon on the home screen.
export const ITINERARY: { city: string; countryCode: string }[] = [
  { city: "İstanbul", countryCode: "TR" },
  { city: "Sofia", countryCode: "BG" },
  { city: "Belgrade", countryCode: "RS" },
  { city: "Pécs", countryCode: "HU" },
  { city: "Zagreb", countryCode: "HR" },
  { city: "Ljubljana", countryCode: "SI" },
  { city: "Trieste", countryCode: "IT" },
  { city: "Izola", countryCode: "SI" },
];

// Local currency units per €1 — defaults; editable in-app (Settings).
export const DEFAULT_RATES: Record<TripCurrency, number> = {
  EUR: 1,
  TRY: 48.0,
  BGN: 1.9558,
  RSD: 117.2,
  HUF: 398.0,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  TRY: "₺",
  BGN: "лв",
  RSD: "дин",
  HUF: "Ft",
};

// Common charger networks
export const CHARGER_NETWORKS = [
  "Tesla Supercharger",
  "Ionity",
  "Shell Recharge",
  "Plugsurfing",
  "Greenway",
  "Other",
] as const;

// Connector types
export const CONNECTOR_TYPES = ["CCS2", "Tesla", "Type 2", "CHAdeMO"] as const;
