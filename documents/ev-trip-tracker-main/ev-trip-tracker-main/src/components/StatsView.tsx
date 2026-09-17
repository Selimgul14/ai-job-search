import type { TripStats } from "@/lib/charges";
import { formatEur } from "@/lib/utils";

// Stats screen: trip totals, spend-by-country bars, and a metric grid.
export function StatsView({ stats }: { stats: TripStats }) {
  return (
    <div>
      {/* totals card */}
      <div className="bg-ink rounded-[26px] p-[22px] text-white">
        <div className="text-xs font-bold tracking-[0.05em] opacity-80">
          TRIP TOTALS
        </div>
        <div className="flex items-baseline gap-2.5 mt-1.5">
          <div className="text-[40px] font-extrabold tracking-[-0.03em] leading-none">
            {formatEur(stats.totalEur)}
          </div>
          <div className="text-[15px] font-bold opacity-70">
            ·{" "}
            {stats.totalKwh.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}{" "}
            kWh
          </div>
        </div>
        <div className="text-xs opacity-75 mt-2 font-semibold">
          across {stats.stops} stops & {Math.round(stats.totalKm)} km
        </div>
      </div>

      {/* spend by country */}
      <div className="mt-[22px]">
        <div className="text-[13px] font-extrabold mb-3.5">Spend by country</div>
        <div className="flex flex-col gap-3.5">
          {stats.byCountry.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[13px] font-bold">
                  {c.flag} {c.name}
                </div>
                <div className="font-mono text-xs font-bold text-ink">
                  {formatEur(c.eur)}
                </div>
              </div>
              <div className="h-2.5 bg-track rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md bg-accent"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          ))}
          {stats.byCountry.length === 0 && (
            <div className="text-[13px] text-[#8a93a0] font-semibold">
              No spend recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* metric grid */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricTile
          big={formatEur(stats.avgPriceEur)}
          label="avg price / kWh"
        />
        <MetricTile big={stats.totalTimeLabel} label="total charging time" />
        <MetricTile
          big={`${stats.avgSpeed} kW`}
          label={`avg speed · ${stats.peakSpeed} kW peak`}
        />
        <MetricTile big={`${stats.eff} Wh/km`} label="avg efficiency" />
        <MetricTile
          big={stats.cheapest ? `${formatEur(stats.cheapest.eurPerKwh)}/kWh` : "—"}
          label={`cheapest · ${stats.cheapest?.city ?? "—"}`}
        />
        <MetricTile
          big={stats.bestEff ? `${stats.bestEff.eff} Wh/km` : "—"}
          label={`best leg · ${stats.bestEff?.city ?? "—"}`}
        />
      </div>
    </div>
  );
}

function MetricTile({ big, label }: { big: string; label: string }) {
  return (
    <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_18px_-14px_rgba(22,49,74,0.3)]">
      <div className="text-[17px] font-extrabold">{big}</div>
      <div className="text-[11px] text-[#8a93a0] font-bold mt-0.5">{label}</div>
    </div>
  );
}
