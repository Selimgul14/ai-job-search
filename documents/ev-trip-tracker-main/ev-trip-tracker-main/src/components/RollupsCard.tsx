import type { TripRollups } from "@/lib/charges";
import { formatEur } from "@/lib/utils";

// Trip rollups on the Stats screen, led by money saved vs an equivalent petrol car.
export function RollupsCard({ rollups }: { rollups: TripRollups }) {
  const saved = rollups.savedEur;
  const positive = saved >= 0;

  return (
    <div>
      <div className="text-[13px] font-extrabold mb-3.5">Trip rollups</div>

      {/* hero: saved vs petrol */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_6px_18px_-14px_rgba(22,49,74,0.3)]">
        <div className="text-xs font-bold tracking-[0.05em] text-[#8a93a0] uppercase">
          {positive ? "Saved vs petrol" : "Extra vs petrol"}
        </div>
        <div
          className="text-[40px] font-extrabold tracking-[-0.03em] leading-none mt-1.5"
          style={{ color: positive ? "#1fa37a" : "#d9482c" }}
        >
          {formatEur(Math.abs(saved))}
        </div>
        <div className="text-xs text-[#8a93a0] font-semibold mt-2">
          A petrol car (~{rollups.petrolConsumption} L/100km @ €
          {rollups.petrolPrice}/L) would have cost {formatEur(rollups.petrolEur)}.
        </div>
      </div>

      {/* supporting tiles */}
      <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile big={formatEur(rollups.costPer100Eur)} label="cost / 100 km" />
        <Tile big={formatEur(rollups.eurPerDay)} label={`per day · ${rollups.days} days`} />
        <Tile big={formatEur(rollups.petrolEur)} label="petrol equivalent" />
        <Tile
          big={`${Math.round(rollups.co2KgAvoided)} kg`}
          label="CO₂ avoided vs petrol"
        />
      </div>
    </div>
  );
}

function Tile({ big, label }: { big: string; label: string }) {
  return (
    <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_18px_-14px_rgba(22,49,74,0.3)]">
      <div className="text-[17px] font-extrabold">{big}</div>
      <div className="text-[11px] text-[#8a93a0] font-bold mt-0.5">{label}</div>
    </div>
  );
}
