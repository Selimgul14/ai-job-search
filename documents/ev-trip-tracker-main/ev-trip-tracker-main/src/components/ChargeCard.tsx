"use client";

import type { DecoratedCharge } from "@/lib/charges";

// Single charging stop in the home list. Tapping opens the detail sheet.
export function ChargeCard({
  charge,
  onOpen,
}: {
  charge: DecoratedCharge;
  onOpen: () => void;
}) {
  const c = charge.raw;
  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-[20px] p-4 shadow-[0_6px_18px_-12px_rgba(22,49,74,0.3)] cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-[13px] bg-accent-soft flex items-center justify-center text-[21px] shrink-0">
            {charge.flag}
          </div>
          <div className="min-w-0">
            <div className="text-base font-extrabold">{c.city}</div>
            <div className="text-[11px] text-[#8a93a0] font-semibold truncate max-w-[170px]">
              {c.location_name}
              {c.charger_network ? ` · ${c.charger_network}` : ""}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[17px] font-extrabold">{charge.costEur}</div>
          <div className="text-[11px] text-[#8a93a0] font-semibold">
            {charge.costLocal}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-3.5 pt-[13px] border-t border-[#f1ece3]">
        <Stat value={charge.kwhLabel} label="kWh" />
        <Stat value={charge.powerLabel} label="peak" />
        <Stat value={charge.battRange} label="battery" />
        <Stat value={charge.durationLabel} label="time" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-sm font-extrabold">{value}</div>
      <div className="text-[10px] text-[#8a93a0] font-semibold">{label}</div>
    </div>
  );
}
