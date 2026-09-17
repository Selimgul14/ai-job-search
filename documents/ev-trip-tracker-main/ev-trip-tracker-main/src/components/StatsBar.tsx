import type { TripStats } from "@/lib/charges";
import { formatEur } from "@/lib/utils";

// Hero summary card on the home screen: total spend + headline metrics.
export function StatsBar({ stats }: { stats: TripStats }) {
  return (
    <div className="bg-accent rounded-[26px] p-[22px] text-white shadow-[0_16px_34px_-14px_rgba(255,90,60,0.6)]">
      <div className="text-xs font-bold tracking-[0.05em] opacity-90">
        SPENT SO FAR
      </div>
      <div className="text-[44px] font-extrabold tracking-[-0.03em] leading-none mt-[5px]">
        {formatEur(stats.totalEur)}
      </div>

      <div className="flex mt-5">
        <Metric
          value={stats.totalKwh.toLocaleString("en-US", {
            maximumFractionDigits: 1,
          })}
          label="kWh charged"
        />
        <Divider />
        <Metric
          value={Math.round(stats.totalKm).toLocaleString("en-US")}
          label="km driven"
        />
        <Divider />
        <Metric value={String(stats.eff)} label="Wh/km" />
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[11px] opacity-90 font-semibold">{label}</div>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-white/30 mx-4" />;
}
