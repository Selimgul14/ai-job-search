"use client";

// Trip-level settings stored on the device. These give the efficiency model the
// baselines it needs: the start odometer (so the first leg has a distance) and
// the start battery % (so the first leg has a consumption), plus the usable
// pack capacity used to turn a battery-% drop into kWh consumed.

import { useEffect, useState } from "react";

const TRIP_KEY = "tt_trip_v1";

export interface TripSettings {
  startOdometer: number | null; // odometer (km) at the trip's departure point
  startBatteryPct: number | null; // battery % when leaving the start point
  usableCapacityKwh: number | null; // usable pack size; null = auto-estimate
  petrolPricePerL: number | null; // €/litre for the "saved vs petrol" comparison
  petrolConsumptionLper100: number | null; // L/100km of the comparison car
}

const DEFAULTS: TripSettings = {
  startOdometer: null,
  startBatteryPct: null,
  usableCapacityKwh: null,
  petrolPricePerL: null,
  petrolConsumptionLper100: null,
};

export function loadTrip(): TripSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(TRIP_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveTrip(settings: TripSettings): void {
  try {
    window.localStorage.setItem(TRIP_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

/** Reactive trip-settings hook. */
export function useTrip(): [TripSettings, (next: TripSettings) => void] {
  const [trip, setTrip] = useState<TripSettings>({ ...DEFAULTS });

  useEffect(() => setTrip(loadTrip()), []);

  const update = (next: TripSettings) => {
    saveTrip(next);
    setTrip(next);
  };

  return [trip, update];
}
