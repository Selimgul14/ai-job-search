"use client";

// Exchange rates live on the device (localStorage), not in Supabase — they're
// only used to convert each stop to EUR for display. The schema deliberately
// stores cost in the original currency (never converted at write time).

import { useEffect, useState } from "react";
import { DEFAULT_RATES } from "@/types";

const RATES_KEY = "tt_rates_v1";

export type Rates = Record<string, number>;

export function loadRates(): Rates {
  if (typeof window === "undefined") return { ...DEFAULT_RATES };
  try {
    const raw = window.localStorage.getItem(RATES_KEY);
    return raw ? { ...DEFAULT_RATES, ...JSON.parse(raw) } : { ...DEFAULT_RATES };
  } catch {
    return { ...DEFAULT_RATES };
  }
}

export function saveRates(rates: Rates): void {
  try {
    window.localStorage.setItem(RATES_KEY, JSON.stringify({ ...rates, EUR: 1 }));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/** Reactive rates hook used by the home + stats views. */
export function useRates(): [Rates, (next: Rates) => void] {
  const [rates, setRates] = useState<Rates>({ ...DEFAULT_RATES });

  // Hydrate from localStorage on mount (avoids SSR mismatch).
  useEffect(() => setRates(loadRates()), []);

  const update = (next: Rates) => {
    const merged = { ...next, EUR: 1 };
    saveRates(merged);
    setRates(merged);
  };

  return [rates, update];
}
