"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, TRIP_CURRENCIES, CURRENCY_SYMBOLS } from "@/types";
import type { ChargeSession, TripCurrency } from "@/types";
import {
  blankForm,
  chargeToForm,
  formToPayload,
  type ChargeFormState,
} from "@/lib/charges";
import {
  countryByCode,
  efficiencyWhPerKm,
  formatEur,
  num,
  toEur,
} from "@/lib/utils";
import { useRates } from "@/lib/rates";
import { createCharge, updateCharge } from "@/lib/client";
import { Field, TextInput, SelectInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

// Shared add/edit form. Pass `initial` to edit an existing charge.
export function ChargeForm({ initial }: { initial?: ChargeSession }) {
  const router = useRouter();
  const [rates] = useRates();
  const [form, setForm] = useState<ChargeFormState>(
    initial ? chargeToForm(initial) : blankForm(),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoMsg, setGeoMsg] = useState<string | null>(null);

  const isEdit = !!form.id;

  // Capture current GPS coords for the map (Phase 2).
  function captureLocation() {
    if (!("geolocation" in navigator)) {
      setGeoMsg("Geolocation isn’t available on this device.");
      return;
    }
    setGeoMsg("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoMsg(null);
      },
      () => setGeoMsg("Couldn’t get location — enter it manually if needed."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  // Updates one field, with currency defaulting + total-cost auto-calc.
  function setField<K extends keyof ChargeFormState>(
    name: K,
    value: ChargeFormState[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [name]: value } as ChargeFormState;

      if (name === "countryCode") {
        next.currency = countryByCode(String(value))?.currency ?? "EUR";
      }
      if (name === "totalCost") next.costTouched = true;

      const recalcTriggers = ["kwh", "pricePerKwh", "countryCode", "currency"];
      if (recalcTriggers.includes(String(name)) && !next.costTouched) {
        const k = num(next.kwh);
        const p = num(next.pricePerKwh);
        if (k > 0 && p > 0) {
          const dec = next.currency === "BGN" || next.currency === "EUR" ? 2 : 0;
          next.totalCost = (k * p).toFixed(dec);
        }
      }
      return next;
    });
  }

  async function handleSave() {
    if (!form.city.trim() || !form.kwh.trim()) {
      setError("Please add at least a city and kWh charged.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = formToPayload(form);
      if (isEdit) await updateCharge(form.id, payload);
      else await createCharge(payload);
      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSaving(false);
    }
  }

  const eurPreview =
    num(form.totalCost) > 0
      ? formatEur(toEur(num(form.totalCost), form.currency, rates))
      : "—";
  const eff = efficiencyWhPerKm(num(form.kwh), num(form.distanceKm));

  return (
    <>
      <div className="px-5 pt-1.5 flex-1">
        <div className="flex justify-between items-center mb-[18px]">
          <div className="text-[21px] font-extrabold">
            {isEdit ? "Edit charge" : "New charge"}
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm font-bold text-[#8a93a0] p-1.5"
          >
            Cancel
          </button>
        </div>

        {/* city + country */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <Field label="City">
            <TextInput
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              placeholder="Sofia"
            />
          </Field>
          <Field label="Country">
            <SelectInput
              value={form.countryCode}
              onChange={(e) => setField("countryCode", e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="mt-3.5">
          <Field label="Charger location">
            <TextInput
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="Sopharma Mall"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3.5">
          <Field label="Network">
            <TextInput
              value={form.network}
              onChange={(e) => setField("network", e.target.value)}
              placeholder="Supercharger"
            />
          </Field>
          <Field label="Date & time">
            <TextInput
              type="datetime-local"
              value={form.datetime}
              onChange={(e) => setField("datetime", e.target.value)}
              className="!text-[13px] !px-2.5"
            />
          </Field>
        </div>

        <div className="mt-3.5">
          <Field label="PlugShare link">
            <TextInput
              type="url"
              value={form.plugshareUrl}
              onChange={(e) => setField("plugshareUrl", e.target.value)}
              placeholder="https://www.plugshare.com/location/..."
              className="!text-sm"
            />
          </Field>
        </div>

        <div className="h-px bg-line my-5" />

        {/* energy */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="kWh charged">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.kwh}
              onChange={(e) => setField("kwh", e.target.value)}
              placeholder="51.2"
            />
          </Field>
          <Field label="Speed (kW)">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.powerKw}
              onChange={(e) => setField("powerKw", e.target.value)}
              placeholder="170"
            />
          </Field>
        </div>

        {/* cost */}
        <div className="grid grid-cols-2 gap-3 mt-3.5">
          <Field label="Price / kWh">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.pricePerKwh}
              onChange={(e) => setField("pricePerKwh", e.target.value)}
              placeholder="0.79"
            />
          </Field>
          <Field label="Currency">
            <SelectInput
              value={form.currency}
              onChange={(e) =>
                setField("currency", e.target.value as TripCurrency)
              }
            >
              {TRIP_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {CURRENCY_SYMBOLS[c]} {c}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="mt-3.5">
          <Field label="Total cost" hint="(auto-calculated, editable)">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.totalCost}
              onChange={(e) => setField("totalCost", e.target.value)}
              placeholder="40.45"
            />
          </Field>
          <div className="text-xs text-[#8a93a0] font-bold mt-1.5">
            ≈ {eurPreview} in EUR
          </div>
        </div>

        {/* battery */}
        <div className="grid grid-cols-2 gap-3 mt-3.5">
          <Field label="Battery start %">
            <TextInput
              type="number"
              inputMode="numeric"
              value={form.battStart}
              onChange={(e) => setField("battStart", e.target.value)}
              placeholder="15"
            />
          </Field>
          <Field label="Battery end %">
            <TextInput
              type="number"
              inputMode="numeric"
              value={form.battEnd}
              onChange={(e) => setField("battEnd", e.target.value)}
              placeholder="80"
            />
          </Field>
        </div>

        {/* timing + odometer */}
        <div className="grid grid-cols-2 gap-3 mt-3.5">
          <Field label="Duration (min)">
            <TextInput
              type="number"
              inputMode="numeric"
              value={form.durationMin}
              onChange={(e) => setField("durationMin", e.target.value)}
              placeholder="32"
            />
          </Field>
          <Field label="Odometer (km)">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.odometer}
              onChange={(e) => setField("odometer", e.target.value)}
              placeholder="48230"
            />
          </Field>
        </div>

        <div className="mt-3.5">
          <Field
            label="Distance since last"
            hint="optional — only if no odometer"
          >
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.distanceKm}
              onChange={(e) => setField("distanceKm", e.target.value)}
              placeholder="240"
            />
          </Field>
          <div className="text-xs text-[#8a93a0] font-bold mt-1.5">
            Log the odometer each stop and the app fills in leg distance &
            efficiency automatically.
            {eff ? ` This leg ≈ ${eff} Wh/km.` : ""}
          </div>
        </div>

        {/* coordinates (for the map) */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-extrabold tracking-[0.07em] uppercase text-stone">
              Coordinates{" "}
              <span className="text-[#c3b8a6] normal-case tracking-normal font-bold">
                (for map)
              </span>
            </label>
            <button
              type="button"
              onClick={captureLocation}
              className="text-[11px] font-extrabold text-accent"
            >
              📍 Use my location
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.latitude}
              onChange={(e) => setField("latitude", e.target.value)}
              placeholder="Latitude"
            />
            <TextInput
              type="number"
              step="any"
              inputMode="decimal"
              value={form.longitude}
              onChange={(e) => setField("longitude", e.target.value)}
              placeholder="Longitude"
            />
          </div>
          {geoMsg && (
            <div className="text-xs text-[#8a93a0] font-bold mt-1.5">
              {geoMsg}
            </div>
          )}
        </div>

        <div className="mt-3.5">
          <Field label="Notes">
            <TextArea
              rows={2}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Lunch stop, free parking..."
            />
          </Field>
        </div>

        {error && (
          <div className="mt-4 bg-danger-soft text-danger rounded-xl p-3 text-sm font-bold">
            {error}
          </div>
        )}
      </div>

      {/* sticky save */}
      <div className="sticky bottom-0 bg-gradient-to-t from-cream from-70% to-transparent px-5 pt-4 pb-6 mt-2">
        <Button fullWidth onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save charge"}
        </Button>
      </div>
    </>
  );
}
