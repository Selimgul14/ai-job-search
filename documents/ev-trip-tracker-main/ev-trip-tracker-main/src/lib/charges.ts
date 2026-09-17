// Business logic for charge sessions: form <-> DB mapping, per-card display
// decoration, and trip-wide stats. Pure functions — keeps components thin.

import {
  COUNTRIES,
  type ChargeSession,
  type ChargeSessionInsert,
  type TripCurrency,
} from "@/types";
import {
  countryByCode,
  countryByName,
  flagForCountry,
  formatDuration,
  formatEur,
  formatLocal,
  isoToLocalInput,
  localInputNow,
  num,
  toEur,
} from "@/lib/utils";

type Rates = Record<string, number>;

/* ── Form state ──────────────────────────────────────────────────────── */

// All fields are strings while editing (controlled inputs); converted on save.
export interface ChargeFormState {
  id: string;
  city: string;
  countryCode: string;
  location: string;
  network: string;
  plugshareUrl: string;
  datetime: string; // datetime-local value
  kwh: string;
  powerKw: string;
  pricePerKwh: string;
  totalCost: string;
  currency: TripCurrency;
  battStart: string;
  battEnd: string;
  durationMin: string;
  odometer: string; // odometer reading (km) — drives leg distance
  distanceKm: string; // manual fallback when no odometer is logged
  latitude: string; // for the map (Phase 2)
  longitude: string;
  notes: string;
  costTouched: boolean; // user manually edited the total cost
}

export function blankForm(): ChargeFormState {
  return {
    id: "",
    city: "",
    countryCode: "TR",
    location: "",
    network: "",
    plugshareUrl: "",
    datetime: localInputNow(),
    kwh: "",
    powerKw: "",
    pricePerKwh: "",
    totalCost: "",
    currency: "TRY",
    battStart: "",
    battEnd: "",
    durationMin: "",
    odometer: "",
    distanceKm: "",
    latitude: "",
    longitude: "",
    notes: "",
    costTouched: false,
  };
}

/** Populate the form from an existing charge (edit flow). */
export function chargeToForm(c: ChargeSession): ChargeFormState {
  const code = countryByName(c.country)?.code ?? "TR";
  const s = (v: number | null) => (v === 0 || v ? String(v) : "");
  return {
    id: c.id,
    city: c.city ?? "",
    countryCode: code,
    location: c.location_name ?? "",
    network: c.charger_network ?? "",
    plugshareUrl: c.plugshare_url ?? "",
    datetime: isoToLocalInput(c.arrival_time ?? c.session_date),
    kwh: s(c.kwh_charged),
    powerKw: s(c.peak_charging_speed_kw),
    pricePerKwh: s(c.cost_per_kwh),
    totalCost: s(c.cost_amount),
    currency: (c.cost_currency as TripCurrency) ?? "EUR",
    battStart: s(c.battery_pct_arrival),
    battEnd: s(c.battery_pct_departure),
    durationMin: s(c.duration_minutes),
    odometer: s(c.odometer_km),
    distanceKm: s(c.distance_since_last_charge),
    latitude: s(c.latitude),
    longitude: s(c.longitude),
    notes: c.notes ?? "",
    costTouched: true,
  };
}

/** Convert form state into a DB insert/update payload. */
export function formToPayload(f: ChargeFormState): ChargeSessionInsert {
  const country = countryByCode(f.countryCode);
  const arrival = f.datetime ? new Date(f.datetime) : null;
  const duration = f.durationMin ? num(f.durationMin) : null;
  // Derive departure from arrival + duration when both are present.
  const departure =
    arrival && duration
      ? new Date(arrival.getTime() + duration * 60_000)
      : null;

  const opt = (v: string) => (v.trim() === "" ? null : num(v));

  return {
    location_name: f.location.trim() || f.city.trim(),
    city: f.city.trim(),
    country: country?.name ?? f.countryCode,
    charger_network: f.network.trim() || null,
    connector_type: null,
    plugshare_url: f.plugshareUrl.trim() || null,
    latitude: f.latitude.trim() ? num(f.latitude) : null,
    longitude: f.longitude.trim() ? num(f.longitude) : null,

    session_date: f.datetime ? f.datetime.slice(0, 10) : isoDate(),
    arrival_time: arrival ? arrival.toISOString() : null,
    departure_time: departure ? departure.toISOString() : null,
    duration_minutes: duration,

    battery_pct_arrival: opt(f.battStart),
    battery_pct_departure: opt(f.battEnd),

    kwh_charged: opt(f.kwh),
    avg_charging_speed_kw: null,
    peak_charging_speed_kw: opt(f.powerKw),

    cost_amount: opt(f.totalCost),
    cost_currency: f.currency,
    cost_per_kwh: opt(f.pricePerKwh),

    odometer_km: opt(f.odometer),
    distance_since_last_charge: opt(f.distanceKm),
    temperature_celsius: null,

    notes: f.notes.trim() || null,
  };
}

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ── Display decoration ──────────────────────────────────────────────── */

export interface DecoratedCharge {
  raw: ChargeSession;
  flag: string;
  eur: number;
  costEur: string;
  costLocal: string;
  kwhLabel: string;
  powerLabel: string;
  durationLabel: string;
  battRange: string;
  distanceLabel: string;
  effLabel: string;
  eff: number | null;
  priceLabel: string;
  hasPlug: boolean;
  hasNotes: boolean;
}

export function decorateCharge(
  c: ChargeSession,
  rates: Rates,
  leg: LegMetric | null = null, // per-leg distance + efficiency (see computeLegMetrics)
): DecoratedCharge {
  const eur = toEur(c.cost_amount, c.cost_currency, rates);
  const hasBatt =
    c.battery_pct_arrival != null && c.battery_pct_departure != null;
  const distanceKm = leg?.distanceKm ?? null;
  const eff = leg?.eff ?? null;
  return {
    raw: c,
    flag: flagForCountry(c.country),
    eur,
    costEur: formatEur(eur),
    costLocal: formatLocal(c.cost_amount, c.cost_currency),
    kwhLabel: Number(c.kwh_charged ?? 0).toLocaleString("en-US", {
      maximumFractionDigits: 1,
    }),
    powerLabel: c.peak_charging_speed_kw ? `${c.peak_charging_speed_kw} kW` : "—",
    durationLabel: c.duration_minutes ? `${c.duration_minutes} min` : "—",
    battRange: hasBatt
      ? `${c.battery_pct_arrival}→${c.battery_pct_departure}%`
      : "—",
    distanceLabel: distanceKm ? `${Math.round(distanceKm)} km` : "—",
    effLabel: eff ? `${eff} Wh/km` : "—",
    eff,
    priceLabel: c.cost_per_kwh
      ? `${formatLocal(c.cost_per_kwh, c.cost_currency)}/kWh`
      : "—",
    hasPlug: !!c.plugshare_url?.trim(),
    hasNotes: !!c.notes?.trim(),
  };
}

/** Sort newest first by arrival time (fallback session_date). */
export function sortCharges(charges: ChargeSession[]): ChargeSession[] {
  return charges.slice().sort((a, b) => {
    const ka = a.arrival_time ?? a.session_date ?? "";
    const kb = b.arrival_time ?? b.session_date ?? "";
    return ka < kb ? 1 : ka > kb ? -1 : 0;
  });
}

/**
 * Estimate usable battery capacity (kWh) from the charge log:
 *   capacity ≈ kWh added ÷ (battery % gained).
 * Uses the median across sessions with a meaningful charge (Δ ≥ 15%), which is
 * robust to part-charges and free top-ups.
 */
export function estimateUsableCapacity(
  charges: ChargeSession[],
): number | null {
  const samples = charges
    .filter(
      (c) =>
        c.kwh_charged != null &&
        c.battery_pct_arrival != null &&
        c.battery_pct_departure != null &&
        c.battery_pct_departure - c.battery_pct_arrival >= 15,
    )
    .map(
      (c) =>
        (c.kwh_charged as number) /
        ((c.battery_pct_departure! - c.battery_pct_arrival!) / 100),
    )
    .sort((a, b) => a - b);
  if (samples.length === 0) return null;
  const mid = Math.floor(samples.length / 2);
  const median =
    samples.length % 2 ? samples[mid] : (samples[mid - 1] + samples[mid]) / 2;
  return Math.round(median * 10) / 10;
}

export interface LegMetric {
  distanceKm: number | null;
  consumedKwh: number | null; // energy actually used on the leg
  eff: number | null; // Wh/km
  basis: "battery" | "charged" | null; // how eff was derived
}

export interface LegOptions {
  startOdometer?: number | null;
  startBatteryPct?: number | null;
  usableCapacityKwh?: number | null;
}

/**
 * Per-leg distance, energy and efficiency, keyed by charge id. Walks the trip
 * oldest→newest.
 *
 * Distance = this odometer − previous odometer (first leg uses the trip-start
 * odometer baseline); manual "distance since last" is the fallback.
 *
 * Energy/efficiency are measured from the BATTERY DROP while driving, not the
 * kWh added at the stop: the leg consumed `(previous departure % − this
 * arrival %)` of the pack. So topping up to 100% for free no longer inflates
 * efficiency. We fall back to kWh-added ÷ distance only when the battery %s or
 * capacity aren't available.
 */
export function computeLegMetrics(
  charges: ChargeSession[],
  opts: LegOptions = {},
): Record<string, LegMetric> {
  const capacity = opts.usableCapacityKwh ?? estimateUsableCapacity(charges);
  const chrono = [...sortCharges(charges)].reverse(); // oldest first
  const out: Record<string, LegMetric> = {};

  let prevOdo = opts.startOdometer ?? null;
  let prevDeparturePct = opts.startBatteryPct ?? null;

  for (const c of chrono) {
    // distance
    let distanceKm: number | null = null;
    if (c.odometer_km != null && prevOdo != null && c.odometer_km >= prevOdo) {
      distanceKm = c.odometer_km - prevOdo;
    } else if (c.distance_since_last_charge != null) {
      distanceKm = c.distance_since_last_charge;
    }

    // energy / efficiency
    let consumedKwh: number | null = null;
    let eff: number | null = null;
    let basis: LegMetric["basis"] = null;
    const arrival = c.battery_pct_arrival;
    if (
      capacity &&
      prevDeparturePct != null &&
      arrival != null &&
      prevDeparturePct > arrival &&
      distanceKm &&
      distanceKm > 0
    ) {
      consumedKwh = ((prevDeparturePct - arrival) / 100) * capacity;
      eff = Math.round((consumedKwh * 1000) / distanceKm);
      basis = "battery";
    } else if (distanceKm && distanceKm > 0 && c.kwh_charged) {
      consumedKwh = c.kwh_charged;
      eff = Math.round((c.kwh_charged * 1000) / distanceKm);
      basis = "charged";
    }

    out[c.id] = { distanceKm, consumedKwh, eff, basis };

    if (c.odometer_km != null) prevOdo = c.odometer_km; // carry odometer forward
    prevDeparturePct = c.battery_pct_departure ?? null; // departure % for next leg
  }
  return out;
}

/* ── Trip statistics ─────────────────────────────────────────────────── */

export interface TripStats {
  totalEur: number;
  totalKwh: number;
  totalKm: number;
  totalMin: number;
  totalTimeLabel: string;
  stops: number;
  eff: number; // Wh/km overall
  avgSpeed: number;
  peakSpeed: number;
  avgPriceEur: number;
  cheapest: { eurPerKwh: number; city: string } | null;
  bestEff: { eff: number; city: string } | null;
  byCountry: {
    code: string;
    name: string;
    flag: string;
    eur: number;
    pct: number;
  }[];
  dateRange: string;
}

export function computeStats(
  charges: ChargeSession[],
  rates: Rates,
  opts: LegOptions = {},
): TripStats {
  const legs = computeLegMetrics(charges, opts);

  const totalKwh = charges.reduce((s, e) => s + (e.kwh_charged ?? 0), 0);
  const totalEur = charges.reduce(
    (s, e) => s + toEur(e.cost_amount, e.cost_currency, rates),
    0,
  );
  const totalKm = charges.reduce((s, e) => s + (legs[e.id]?.distanceKm ?? 0), 0);
  // Overall efficiency uses energy actually consumed per leg, not kWh added.
  const totalConsumed = charges.reduce(
    (s, e) => s + (legs[e.id]?.consumedKwh ?? 0),
    0,
  );
  const totalMin = charges.reduce((s, e) => s + (e.duration_minutes ?? 0), 0);

  const powers = charges
    .map((e) => e.peak_charging_speed_kw ?? 0)
    .filter((x) => x > 0);
  const avgSpeed = powers.length
    ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length)
    : 0;
  const peakSpeed = powers.length ? Math.max(...powers) : 0;

  let cheapest: TripStats["cheapest"] = null;
  let bestEff: TripStats["bestEff"] = null;
  for (const e of charges) {
    if (e.kwh_charged && e.kwh_charged > 0) {
      const epk = toEur(e.cost_amount, e.cost_currency, rates) / e.kwh_charged;
      if (!cheapest || epk < cheapest.eurPerKwh)
        cheapest = { eurPerKwh: epk, city: e.city };
    }
    const eff = legs[e.id]?.eff ?? null;
    if (eff && (!bestEff || eff < bestEff.eff))
      bestEff = { eff, city: e.city };
  }

  // Spend by country.
  const byc: Record<string, number> = {};
  for (const e of charges) {
    byc[e.country] =
      (byc[e.country] ?? 0) + toEur(e.cost_amount, e.cost_currency, rates);
  }
  const maxc = Math.max(0, ...Object.values(byc));
  const byCountry = Object.keys(byc)
    .sort((a, b) => byc[b] - byc[a])
    .map((name) => {
      const c = COUNTRIES.find((x) => x.name === name);
      return {
        code: c?.code ?? name,
        name,
        flag: c?.flag ?? "🏳️",
        eur: byc[name],
        pct: maxc > 0 ? Math.max(8, Math.round((byc[name] / maxc) * 100)) : 0,
      };
    });

  // Date range across all stops.
  let dateRange = "No charges yet";
  const ds = charges
    .map((e) => new Date(e.arrival_time ?? e.session_date))
    .filter((d) => !isNaN(d.getTime()));
  if (ds.length) {
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const min = new Date(Math.min(...ds.map((d) => d.getTime())));
    const max = new Date(Math.max(...ds.map((d) => d.getTime())));
    dateRange = fmt(min) === fmt(max) ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  }

  return {
    totalEur,
    totalKwh,
    totalKm,
    totalMin,
    totalTimeLabel: formatDuration(totalMin),
    stops: charges.length,
    eff: totalKm > 0 ? Math.round((totalConsumed * 1000) / totalKm) : 0,
    avgSpeed,
    peakSpeed,
    avgPriceEur: totalKwh > 0 ? totalEur / totalKwh : 0,
    cheapest,
    bestEff,
    byCountry,
    dateRange,
  };
}

/* ── Trip rollups (savings vs petrol, cost/100km, €/day, CO₂) ─────────── */

// Defaults for the petrol comparison — overridable in Settings.
export const DEFAULT_PETROL_PRICE_EUR_PER_L = 2.0; // €/litre
export const DEFAULT_PETROL_L_PER_100KM = 7.0; // equivalent ICE consumption
const KG_CO2_PER_L_PETROL = 2.31; // tailpipe CO₂ per litre burned

export interface TripRollups {
  days: number;
  costPer100Eur: number; // actual EV €/100 km
  eurPerDay: number;
  petrolEur: number; // what an equivalent petrol car would have cost
  savedEur: number; // petrolEur − actual EV cost (negative = EV cost more)
  litres: number; // petrol litres avoided
  co2KgAvoided: number; // tailpipe CO₂ avoided
  petrolPrice: number;
  petrolConsumption: number;
}

export function computeRollups(
  stats: TripStats,
  charges: ChargeSession[],
  opts: {
    petrolPricePerL?: number | null;
    petrolConsumptionLper100?: number | null;
  } = {},
): TripRollups {
  const petrolPrice = opts.petrolPricePerL ?? DEFAULT_PETROL_PRICE_EUR_PER_L;
  const petrolConsumption =
    opts.petrolConsumptionLper100 ?? DEFAULT_PETROL_L_PER_100KM;

  const km = stats.totalKm;
  const litres = (km / 100) * petrolConsumption;
  const petrolEur = litres * petrolPrice;

  // Number of calendar days the trip spans (inclusive).
  const ds = charges
    .map((e) => new Date(e.arrival_time ?? e.session_date))
    .filter((d) => !isNaN(d.getTime()))
    .map((d) => d.getTime());
  const days = ds.length
    ? Math.max(1, Math.round((Math.max(...ds) - Math.min(...ds)) / 86_400_000) + 1)
    : 1;

  return {
    days,
    costPer100Eur: km > 0 ? (stats.totalEur / km) * 100 : 0,
    eurPerDay: stats.totalEur / days,
    petrolEur,
    savedEur: petrolEur - stats.totalEur,
    litres,
    co2KgAvoided: litres * KG_CO2_PER_L_PETROL,
    petrolPrice,
    petrolConsumption,
  };
}
