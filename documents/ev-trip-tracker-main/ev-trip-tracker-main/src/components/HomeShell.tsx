"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCharges } from "@/hooks/useCharges";
import { useRates } from "@/lib/rates";
import { useTrip } from "@/lib/trip";
import {
  computeLegMetrics,
  computeRollups,
  computeStats,
  decorateCharge,
  estimateUsableCapacity,
  sortCharges,
  type DecoratedCharge,
} from "@/lib/charges";
import { StatsBar } from "@/components/StatsBar";
import { ChargeList } from "@/components/ChargeList";
import { StatsView } from "@/components/StatsView";
import { BottomNav, type NavScreen } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { ChargeDetailSheet } from "@/components/ChargeDetailSheet";
import { SettingsSheet } from "@/components/SettingsSheet";
import { EfficiencyChart } from "@/components/EfficiencyChart";
import { RollupsCard } from "@/components/RollupsCard";
import { ExportCard } from "@/components/ExportCard";

// Leaflet can't render on the server — load the map only in the browser.
const MapView = dynamic(
  () => import("@/components/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="text-center text-[#8a93a0] font-semibold pt-20">
        Loading map…
      </div>
    ),
  },
);

type SheetKind = null | { type: "detail"; id: string } | { type: "settings" };

// Top-level client view: home / map / stats screens + detail/settings sheets.
// Mobile = single phone-width column with a bottom nav; desktop = sidebar nav
// with a wider content panel.
export function HomeShell() {
  const router = useRouter();
  const { charges, loading, error, remove } = useCharges();
  const [rates, setRates] = useRates();
  const [trip, setTrip] = useTrip();
  const [screen, setScreen] = useState<NavScreen>("home");
  const [sheet, setSheet] = useState<SheetKind>(null);

  // Per-leg metrics: odometer-derived distance + battery-based efficiency.
  const legs = useMemo(() => computeLegMetrics(charges, trip), [charges, trip]);
  const decorated: DecoratedCharge[] = useMemo(
    () =>
      sortCharges(charges).map((c) =>
        decorateCharge(c, rates, legs[c.id] ?? null),
      ),
    [charges, rates, legs],
  );
  const stats = useMemo(() => computeStats(charges, rates, trip), [
    charges,
    rates,
    trip,
  ]);
  const estimatedCapacity = useMemo(
    () => estimateUsableCapacity(charges),
    [charges],
  );
  const rollups = useMemo(() => computeRollups(stats, charges, trip), [
    stats,
    charges,
    trip,
  ]);

  const detailCharge =
    sheet?.type === "detail"
      ? (decorated.find((d) => d.raw.id === sheet.id) ?? null)
      : null;

  const mappedCount = decorated.filter(
    (d) =>
      Number.isFinite(Number(d.raw.latitude)) &&
      Number.isFinite(Number(d.raw.longitude)),
  ).length;

  const goAdd = () => router.push("/add");
  const openSettings = () => setSheet({ type: "settings" });

  return (
    <div className="min-h-screen bg-sand text-ink">
      <div className="mx-auto w-full max-w-[1100px] lg:flex lg:items-start lg:gap-6 lg:px-6 lg:py-6">
        {/* desktop sidebar */}
        <Sidebar
          active={screen}
          dateRange={stats.dateRange}
          onNavigate={setScreen}
          onAdd={goAdd}
          onSettings={openSettings}
        />

        {/* main panel */}
        <div className="w-full max-w-[460px] mx-auto bg-cream min-h-screen flex flex-col shadow-[0_0_70px_rgba(70,45,20,0.10)] lg:max-w-none lg:flex-1 lg:mx-0 lg:min-h-0 lg:rounded-[28px] lg:shadow-[0_20px_60px_-30px_rgba(70,45,20,0.4)] lg:overflow-hidden">
          {/* header (mobile only — desktop shows the brand in the sidebar) */}
          <div className="px-[22px] pt-5 pb-1.5 lg:hidden">
            <div className="font-mono text-[11px] tracking-[0.16em] text-accent font-bold uppercase">
              {stats.dateRange}
            </div>
            <div className="text-[25px] font-extrabold tracking-[-0.02em] mt-[3px]">
              Adriatic Loop
            </div>
          </div>

          {/* content */}
          <div className="no-scrollbar flex-1 overflow-y-auto pb-24 lg:pb-7 lg:pt-6">
            {loading ? (
              <div className="text-center text-[#8a93a0] font-semibold mt-20">
                Loading charges…
              </div>
            ) : error ? (
              <div className="mx-[18px] lg:mx-7 mt-6 bg-danger-soft text-danger rounded-[15px] p-4 text-sm font-bold">
                Couldn’t load charges: {error}
                <div className="text-xs font-semibold mt-1 text-[#9a3520]">
                  Check your Supabase keys in <code>.env.local</code>.
                </div>
              </div>
            ) : screen === "home" ? (
              <div className="px-[18px] lg:px-7 pt-3.5 lg:pt-0 space-y-[22px]">
                <StatsBar stats={stats} />
                <ChargeList
                  charges={decorated}
                  onOpen={(id) => setSheet({ type: "detail", id })}
                />
              </div>
            ) : screen === "map" ? (
              <div className="px-[18px] lg:px-7 pt-3.5 lg:pt-0">
                <div className="h-[70vh] rounded-[20px] overflow-hidden shadow-[0_6px_18px_-12px_rgba(22,49,74,0.3)]">
                  <MapView
                    charges={decorated}
                    onOpen={(id) => setSheet({ type: "detail", id })}
                  />
                </div>
                <div className="text-xs text-[#8a93a0] font-bold mt-2.5 text-center">
                  {mappedCount} of {decorated.length} stops mapped
                </div>
              </div>
            ) : (
              <div className="px-[18px] lg:px-7 pt-3.5 lg:pt-0 space-y-[22px]">
                <StatsView stats={stats} />
                <RollupsCard rollups={rollups} />
                <EfficiencyChart charges={decorated} />
                <ExportCard charges={charges} rates={rates} trip={trip} />
              </div>
            )}
          </div>

          {/* bottom nav (mobile only — hides itself on desktop) */}
          <BottomNav
            active={screen}
            onNavigate={setScreen}
            onAdd={goAdd}
            onSettings={openSettings}
          />
        </div>
      </div>

      {/* sheets */}
      {detailCharge && (
        <ChargeDetailSheet
          charge={detailCharge}
          onClose={() => setSheet(null)}
          onEdit={() => router.push(`/edit/${detailCharge.raw.id}`)}
          onDelete={async () => {
            await remove(detailCharge.raw.id);
            setSheet(null);
          }}
        />
      )}
      {sheet?.type === "settings" && (
        <SettingsSheet
          rates={rates}
          trip={trip}
          estimatedCapacity={estimatedCapacity}
          onClose={() => setSheet(null)}
          onSave={setRates}
          onSaveTrip={setTrip}
        />
      )}
    </div>
  );
}
