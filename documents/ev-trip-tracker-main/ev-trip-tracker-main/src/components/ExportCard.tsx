"use client";

import { useState } from "react";
import type { ChargeSession } from "@/types";
import type { Rates } from "@/lib/rates";
import type { TripSettings } from "@/lib/trip";
import { exportCsv, exportXlsx } from "@/lib/export";
import { DownloadIcon } from "@/components/icons";

// Download the trip log as CSV or Excel (Stats screen).
export function ExportCard({
  charges,
  rates,
  trip,
}: {
  charges: ChargeSession[];
  rates: Rates;
  trip: TripSettings;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => void | Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const disabled = busy || charges.length === 0;

  return (
    <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_18px_-14px_rgba(22,49,74,0.3)]">
      <div className="text-[13px] font-extrabold mb-1">Export trip data</div>
      <div className="text-xs text-[#8a93a0] font-semibold mb-3">
        Download every stop with EUR conversions and a summary sheet.
      </div>
      <div className="flex gap-2.5">
        <button
          onClick={() => run(() => exportCsv(charges, rates, trip))}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] border-[1.5px] border-[#ddd2c0] text-ink text-sm font-extrabold disabled:opacity-50"
        >
          <DownloadIcon size={16} /> CSV
        </button>
        <button
          onClick={() => run(() => exportXlsx(charges, rates, trip))}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-ink text-white text-sm font-extrabold disabled:opacity-50"
        >
          <DownloadIcon size={16} /> {busy ? "Exporting…" : "Excel"}
        </button>
      </div>
      {error && (
        <div className="text-xs text-danger font-bold mt-2">{error}</div>
      )}
    </div>
  );
}
