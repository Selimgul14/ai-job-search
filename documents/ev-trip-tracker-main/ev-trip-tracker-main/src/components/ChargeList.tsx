"use client";

import type { DecoratedCharge } from "@/lib/charges";
import { ChargeCard } from "@/components/ChargeCard";

// Charging log: header + list of cards, with an empty state when no stops.
export function ChargeList({
  charges,
  onOpen,
}: {
  charges: DecoratedCharge[];
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <div className="text-[13px] font-extrabold">Charging log</div>
        <div className="font-mono text-[11px] text-[#9a8e7c]">
          {charges.length} STOPS
        </div>
      </div>

      {charges.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3.5">
          {charges.map((c) => (
            <ChargeCard
              key={c.raw.id}
              charge={c}
              onOpen={() => onOpen(c.raw.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-[18px] bg-white border-[1.5px] border-dashed border-[#e2d8c7] rounded-[20px] px-6 py-[34px] text-center">
          <div className="text-[34px]">⚡</div>
          <div className="text-base font-extrabold mt-2">
            No charges logged yet
          </div>
          <div className="text-[13px] text-[#8a93a0] mt-1 leading-relaxed">
            Tap the <b className="text-accent">+</b> button to log your first
            charging stop.
          </div>
        </div>
      )}
    </div>
  );
}
