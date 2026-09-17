// Utility helpers — formatting, currency conversion, route lookups.
// Pure functions only; no React, no Supabase.

import {
  COUNTRIES,
  CURRENCY_SYMBOLS,
  type Country,
  type TripCurrency,
} from "@/types";

type Rates = Record<string, number>;

/* ── Route / country lookups ─────────────────────────────────────────── */

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function countryByName(name: string | null): Country | undefined {
  if (!name) return undefined;
  return COUNTRIES.find((c) => c.name === name);
}

/** Flag emoji for a stored country name (falls back to a neutral flag). */
export function flagForCountry(name: string | null): string {
  return countryByName(name)?.flag ?? "🏳️";
}

/* ── Currency formatting + conversion ────────────────────────────────── */

/** Convert a local amount to EUR using `rates` (local units per €1). */
export function toEur(
  amount: number | null,
  currency: string | null,
  rates: Rates,
): number {
  if (amount == null) return 0;
  const r = (currency && rates[currency]) || 1;
  return amount / r;
}

/** Format an amount in EUR, e.g. "€40.45". */
export function formatEur(amount: number | null): string {
  return (
    "€" +
    Number(amount ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Format an amount in its original currency with the right symbol. */
export function formatLocal(
  amount: number | null,
  currency: string | null,
): string {
  if (amount == null || !currency) return "—";
  const dec = currency === "BGN" || currency === "EUR" ? 2 : 0;
  const n = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
  if (currency === "EUR") return "€" + n;
  if (currency === "TRY") return n + " ₺";
  return n + " " + (CURRENCY_SYMBOLS[currency] ?? currency);
}

/** Format an existing cost (kept for callers; uses Intl currency style). */
export function formatCost(
  amount: number | null,
  currency: string | null,
): string {
  if (amount === null || currency === null) return "—";
  return formatLocal(amount, currency);
}

/* ── Energy / battery / time formatting ──────────────────────────────── */

export function formatKwh(kwh: number | null): string {
  if (kwh === null) return "—";
  return `${kwh.toLocaleString("en-US", { maximumFractionDigits: 1 })} kWh`;
}

export function formatKw(kw: number | null): string {
  if (kw === null) return "—";
  return `${kw.toFixed(0)} kW`;
}

export function formatPct(pct: number | null): string {
  if (pct === null) return "—";
  return `${pct}%`;
}

/** Minutes → "1h 23m" (or "23m"). */
export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Derive duration in minutes from two ISO timestamps. */
export function deriveDurationMinutes(
  arrival: string | null,
  departure: string | null,
): number | null {
  if (!arrival || !departure) return null;
  const ms = new Date(departure).getTime() - new Date(arrival).getTime();
  return Math.round(ms / 60_000);
}

/** Energy efficiency in Wh/km, or null if distance is missing. */
export function efficiencyWhPerKm(
  kwh: number | null,
  distanceKm: number | null,
): number | null {
  if (!kwh || !distanceKm || distanceKm <= 0) return null;
  return Math.round((kwh * 1000) / distanceKm);
}

/* ── Dates ───────────────────────────────────────────────────────────── */

/** "16 Jun" style short date. */
export function formatShortDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** "14:05" style time from a timestamp. */
export function formatTime(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Convert an ISO timestamp to a value for <input type="datetime-local">. */
export function isoToLocalInput(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) return localInputNow();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours(),
  )}:${p(d.getMinutes())}`;
}

/** Current local time as a datetime-local value. */
export function localInputNow(): string {
  return isoToLocalInput(new Date().toISOString());
}

/** Safe number parse — returns 0 for blanks/NaN. */
export function num(v: unknown): number {
  const n = parseFloat(String(v));
  return isNaN(n) ? 0 : n;
}

/** Currency for a given currency value reused across the route. */
export type { TripCurrency };
