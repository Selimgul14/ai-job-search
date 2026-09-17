"use client";

import { useState } from "react";
import { TRIP_CURRENCIES, CURRENCY_SYMBOLS } from "@/types";
import type { Rates } from "@/lib/rates";
import type { TripSettings } from "@/lib/trip";
import { num } from "@/lib/utils";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";

// Editor for on-device settings: exchange rates + the trip-start odometer
// baseline (so the first charge has a leg to measure distance against).
export function SettingsSheet({
  rates,
  trip,
  estimatedCapacity,
  onClose,
  onSave,
  onSaveTrip,
}: {
  rates: Rates;
  trip: TripSettings;
  estimatedCapacity: number | null;
  onClose: () => void;
  onSave: (next: Rates) => void;
  onSaveTrip: (next: TripSettings) => void;
}) {
  const editable = TRIP_CURRENCIES.filter((c) => c !== "EUR");
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(editable.map((c) => [c, String(rates[c] ?? "")])),
  );
  const [startOdo, setStartOdo] = useState(
    trip.startOdometer != null ? String(trip.startOdometer) : "",
  );
  const [startBatt, setStartBatt] = useState(
    trip.startBatteryPct != null ? String(trip.startBatteryPct) : "",
  );
  const [capacity, setCapacity] = useState(
    trip.usableCapacityKwh != null ? String(trip.usableCapacityKwh) : "",
  );
  const [petrolPrice, setPetrolPrice] = useState(
    trip.petrolPricePerL != null ? String(trip.petrolPricePerL) : "",
  );
  const [petrolCons, setPetrolCons] = useState(
    trip.petrolConsumptionLper100 != null
      ? String(trip.petrolConsumptionLper100)
      : "",
  );

  const save = () => {
    const next: Rates = { EUR: 1 };
    for (const c of editable) {
      const n = num(form[c]);
      next[c] = n > 0 ? n : (rates[c] ?? 1);
    }
    onSave(next);
    onSaveTrip({
      startOdometer: startOdo.trim() ? num(startOdo) : null,
      startBatteryPct: startBatt.trim() ? num(startBatt) : null,
      usableCapacityKwh: capacity.trim() ? num(capacity) : null,
      petrolPricePerL: petrolPrice.trim() ? num(petrolPrice) : null,
      petrolConsumptionLper100: petrolCons.trim() ? num(petrolCons) : null,
    });
    onClose();
  };

  return (
    <Sheet onClose={onClose}>
      <div className="px-[22px] pb-7 pt-1.5">
        <div className="flex justify-between items-center mb-[18px]">
          <div className="text-[21px] font-extrabold">Settings</div>
          <button
            onClick={onClose}
            className="text-[22px] text-[#a99e8c] px-2 py-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* trip start baseline */}
        <div className="text-[13px] font-extrabold mb-1">Trip start</div>
        <div className="text-xs text-[#8a93a0] font-semibold mb-3.5">
          Odometer and battery % when you left İstanbul. These set the baseline
          so your first leg’s distance and efficiency are correct.
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            type="number"
            step="any"
            inputMode="decimal"
            value={startOdo}
            onChange={(e) => setStartOdo(e.target.value)}
            placeholder="Odometer km"
          />
          <TextInput
            type="number"
            inputMode="numeric"
            value={startBatt}
            onChange={(e) => setStartBatt(e.target.value)}
            placeholder="Battery %"
          />
        </div>

        <div className="h-px bg-line my-5" />

        {/* battery model */}
        <div className="text-[13px] font-extrabold mb-1">Battery</div>
        <div className="text-xs text-[#8a93a0] font-semibold mb-3.5">
          Usable pack capacity (kWh). Efficiency is measured from the battery
          drop while driving, so a free top-up to 100% no longer skews it. Leave
          blank to auto-estimate from your charges.
        </div>
        <TextInput
          type="number"
          step="any"
          inputMode="decimal"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder={
            estimatedCapacity != null
              ? `Auto: ~${estimatedCapacity} kWh`
              : "e.g. 59"
          }
        />

        <div className="h-px bg-line my-5" />

        {/* petrol comparison */}
        <div className="text-[13px] font-extrabold mb-1">Compare vs petrol</div>
        <div className="text-xs text-[#8a93a0] font-semibold mb-3.5">
          An equivalent petrol car, used for the “saved vs petrol” rollup.
          Defaults to €2.00/L and 7 L/100km.
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            type="number"
            step="any"
            inputMode="decimal"
            value={petrolPrice}
            onChange={(e) => setPetrolPrice(e.target.value)}
            placeholder="€/L (2.00)"
          />
          <TextInput
            type="number"
            step="any"
            inputMode="decimal"
            value={petrolCons}
            onChange={(e) => setPetrolCons(e.target.value)}
            placeholder="L/100km (7)"
          />
        </div>

        <div className="h-px bg-line my-5" />

        {/* exchange rates */}
        <div className="text-[13px] font-extrabold mb-1">Exchange rates</div>
        <div className="text-xs text-[#8a93a0] font-semibold mb-3.5">
          Local currency units per €1. Used to convert every stop to EUR.
        </div>

        <div className="flex flex-col gap-2.5">
          {editable.map((c) => (
            <div key={c} className="flex items-center gap-3">
              <div className="w-[78px] text-sm font-extrabold">
                {CURRENCY_SYMBOLS[c]} {c}
              </div>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                value={form[c]}
                onChange={(e) =>
                  setForm((s) => ({ ...s, [c]: e.target.value }))
                }
                className="flex-1 px-3.5 py-2.5 border-[1.5px] border-line rounded-xl text-[15px] font-semibold bg-white text-ink outline-none"
              />
            </div>
          ))}
        </div>

        <Button fullWidth onClick={save} className="mt-5">
          Save settings
        </Button>

        <div className="mt-4 text-xs text-[#9a8e7c] font-semibold leading-relaxed">
          Charges are stored in Supabase in their original currency — rates only
          affect the EUR figures shown in the app.
        </div>
      </div>
    </Sheet>
  );
}
