"use client";

import { useState } from "react";
import type { DecoratedCharge } from "@/lib/charges";
import { formatShortDate, formatTime } from "@/lib/utils";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { PinIcon } from "@/components/icons";

// Full detail view for one charge, shown as a bottom sheet.
export function ChargeDetailSheet({
  charge,
  onClose,
  onEdit,
  onDelete,
}: {
  charge: DecoratedCharge;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const c = charge.raw;
  const when = c.arrival_time ?? c.session_date;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet onClose={onClose}>
      <div className="px-[22px] pb-7 pt-1.5">
        <div className="flex justify-between items-start mb-[18px]">
          <div className="flex items-center gap-[13px]">
            <div className="w-[50px] h-[50px] rounded-[15px] bg-accent-soft flex items-center justify-center text-2xl">
              {charge.flag}
            </div>
            <div>
              <div className="text-[22px] font-extrabold leading-tight">
                {c.city}
              </div>
              <div className="text-xs text-[#8a93a0] font-semibold">
                {formatShortDate(when)} · {formatTime(when)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[22px] text-[#a99e8c] px-2 py-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="text-[13px] text-[#8a93a0] font-semibold mb-[18px]">
          {c.location_name}
          {c.charger_network ? ` · ${c.charger_network}` : ""}
        </div>

        {/* hero cost */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_6px_18px_-14px_rgba(22,49,74,0.3)] flex justify-between items-center">
          <div>
            <div className="text-[32px] font-extrabold tracking-[-0.02em]">
              {charge.costEur}
            </div>
            <div className="text-[13px] text-[#8a93a0] font-bold">
              {charge.costLocal} · {charge.priceLabel}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[26px] font-extrabold text-accent">
              {charge.kwhLabel}
            </div>
            <div className="text-xs text-[#8a93a0] font-bold">kWh</div>
          </div>
        </div>

        {/* metric grid */}
        <div className="mt-3.5 grid grid-cols-3 gap-2.5">
          <Tile value={charge.powerLabel} label="peak speed" />
          <Tile value={charge.battRange} label="battery" />
          <Tile value={charge.durationLabel} label="duration" />
          <Tile value={charge.distanceLabel} label="distance" />
          <Tile value={charge.effLabel} label="efficiency" />
          <Tile
            value={c.odometer_km ? `${c.odometer_km.toLocaleString()} km` : "—"}
            label="odometer"
          />
        </div>

        {charge.hasNotes && (
          <div className="mt-3.5 bg-[#f4ecdf] rounded-[15px] p-3.5 text-sm font-semibold text-[#5c6b7a] leading-relaxed">
            {c.notes}
          </div>
        )}

        {charge.hasPlug && (
          <a
            href={c.plugshare_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-[9px] mt-3.5 bg-ink text-white p-[15px] rounded-[15px] text-[15px] font-extrabold no-underline"
          >
            <PinIcon />
            Open in PlugShare
          </a>
        )}

        {/* actions */}
        <div className="flex gap-2.5 mt-[18px]">
          <Button variant="secondary" fullWidth onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => setConfirming(true)}
          >
            Delete
          </Button>
        </div>

        {confirming && (
          <div className="mt-3 bg-danger-soft rounded-[15px] p-4 text-center">
            <div className="text-sm font-bold text-[#9a3520]">
              Delete this charge permanently?
            </div>
            <div className="flex gap-2.5 mt-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-3 rounded-xl bg-white font-extrabold text-sm"
              >
                Keep
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-danger text-white font-extrabold text-sm disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-[15px] p-3.5">
      <div className="text-base font-extrabold">{value}</div>
      <div className="text-[10px] text-[#8a93a0] font-bold mt-0.5">{label}</div>
    </div>
  );
}
