import type { DecoratedCharge } from "@/lib/charges";

// Horizontal bar chart of Wh/km per leg (lower = more efficient). Dependency-free
// — bars are plain divs scaled to the worst leg. Shown chronologically.
export function EfficiencyChart({
  charges,
}: {
  charges: DecoratedCharge[];
}) {
  // Oldest → newest, only legs with a computed efficiency.
  const legs = [...charges].reverse().filter((c) => c.eff != null);
  if (legs.length === 0) return null;

  const max = Math.max(...legs.map((c) => c.eff as number));

  return (
    <div>
      <div className="text-[13px] font-extrabold mb-1">Efficiency by leg</div>
      <div className="text-xs text-[#8a93a0] font-semibold mb-3.5">
        Wh/km for each leg — lower is better.
      </div>
      <div className="flex flex-col gap-2.5">
        {legs.map((c) => {
          const eff = c.eff as number;
          const pct = max > 0 ? Math.max(6, Math.round((eff / max) * 100)) : 0;
          return (
            <div key={c.raw.id} className="flex items-center gap-2.5">
              <div className="w-[68px] shrink-0 text-[12px] font-bold truncate">
                {c.raw.city}
              </div>
              <div className="flex-1 h-5 bg-track rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md bg-accent flex items-center justify-end pr-2"
                  style={{ width: `${pct}%` }}
                >
                  <span className="text-[10px] font-extrabold text-white">
                    {eff}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
