"use client";

// Trip data export — CSV (no dependency) and .xlsx (SheetJS, dynamically
// imported so it stays out of the initial bundle).

import type { ChargeSession } from "@/types";
import type { Rates } from "@/lib/rates";
import type { TripSettings } from "@/lib/trip";
import { computeLegMetrics, computeStats, sortCharges } from "@/lib/charges";
import { toEur } from "@/lib/utils";

type Row = Record<string, string | number | null>;

const round2 = (n: number) => Math.round(n * 100) / 100;

// One row per charge, chronological, with numbers kept raw so Excel can sum them.
function buildRows(
  charges: ChargeSession[],
  rates: Rates,
  trip: TripSettings,
): Row[] {
  const legs = computeLegMetrics(charges, trip);
  const chrono = [...sortCharges(charges)].reverse(); // oldest first

  return chrono.map((c) => {
    const leg = legs[c.id];
    return {
      Date: c.session_date,
      City: c.city,
      Country: c.country,
      Location: c.location_name,
      Network: c.charger_network ?? "",
      kWh: c.kwh_charged,
      "Peak kW": c.peak_charging_speed_kw,
      "Price/kWh (local)": c.cost_per_kwh,
      Currency: c.cost_currency ?? "",
      "Cost (local)": c.cost_amount,
      "Cost (EUR)": c.cost_amount != null
        ? round2(toEur(c.cost_amount, c.cost_currency, rates))
        : null,
      "Battery start %": c.battery_pct_arrival,
      "Battery end %": c.battery_pct_departure,
      "Duration (min)": c.duration_minutes,
      "Odometer (km)": c.odometer_km,
      "Leg distance (km)": leg?.distanceKm ?? null,
      "Consumed kWh": leg?.consumedKwh != null ? round2(leg.consumedKwh) : null,
      "Efficiency (Wh/km)": leg?.eff ?? null,
      PlugShare: c.plugshare_url ?? "",
      Notes: c.notes ?? "",
    };
  });
}

// Key/value summary sheet rows.
function buildSummary(
  charges: ChargeSession[],
  rates: Rates,
  trip: TripSettings,
): Row[] {
  const s = computeStats(charges, rates, trip);
  const rows: Row[] = [
    { Metric: "Trip dates", Value: s.dateRange },
    { Metric: "Stops", Value: s.stops },
    { Metric: "Total kWh", Value: round2(s.totalKwh) },
    { Metric: "Total cost (EUR)", Value: round2(s.totalEur) },
    { Metric: "Total distance (km)", Value: Math.round(s.totalKm) },
    { Metric: "Overall efficiency (Wh/km)", Value: s.eff },
    { Metric: "Avg price/kWh (EUR)", Value: round2(s.avgPriceEur) },
    { Metric: "Avg speed (kW)", Value: s.avgSpeed },
    { Metric: "Peak speed (kW)", Value: s.peakSpeed },
    { Metric: "Total charging time", Value: s.totalTimeLabel },
  ];
  for (const c of s.byCountry) {
    rows.push({ Metric: `Spend — ${c.name} (EUR)`, Value: round2(c.eur) });
  }
  return rows;
}

/* ── CSV ─────────────────────────────────────────────────────────────── */

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number | null) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n");
}

function download(filename: string, content: BlobPart, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(
  charges: ChargeSession[],
  rates: Rates,
  trip: TripSettings,
) {
  const csv = toCsv(buildRows(charges, rates, trip));
  download("ev-trip-charges.csv", csv, "text/csv;charset=utf-8");
}

/* ── Excel (.xlsx) ───────────────────────────────────────────────────── */

export async function exportXlsx(
  charges: ChargeSession[],
  rates: Rates,
  trip: TripSettings,
) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(buildRows(charges, rates, trip)),
    "Charges",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(buildSummary(charges, rates, trip)),
    "Summary",
  );
  XLSX.writeFile(wb, "ev-trip-charges.xlsx");
}
