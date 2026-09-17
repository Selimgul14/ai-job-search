"use client";

import {
  HomeIcon,
  MapIcon,
  PlusIcon,
  SettingsIcon,
  StatsIcon,
} from "@/components/icons";
import type { NavScreen } from "@/components/BottomNav";

// Desktop-only left navigation rail (hidden on mobile, where BottomNav is used).
export function Sidebar({
  active,
  dateRange,
  onNavigate,
  onAdd,
  onSettings,
}: {
  active: NavScreen;
  dateRange: string;
  onNavigate: (screen: NavScreen) => void;
  onAdd: () => void;
  onSettings: () => void;
}) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 bg-cream rounded-[28px] p-5 self-start sticky top-6 shadow-[0_20px_60px_-30px_rgba(70,45,20,0.4)]">
      {/* brand */}
      <div className="px-2 mb-5">
        <div className="font-mono text-[11px] tracking-[0.16em] text-accent font-bold uppercase">
          {dateRange}
        </div>
        <div className="text-[22px] font-extrabold tracking-[-0.02em] mt-1">
          Adriatic Loop
        </div>
      </div>

      {/* primary action */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 bg-accent text-white rounded-[14px] py-3 text-[15px] font-extrabold shadow-[0_10px_24px_-8px_rgba(255,90,60,0.6)] active:scale-[0.99] transition mb-4"
      >
        <PlusIcon size={20} /> Log charge
      </button>

      {/* nav */}
      <nav className="flex flex-col gap-1">
        <Item
          label="Home"
          active={active === "home"}
          onClick={() => onNavigate("home")}
          icon={(c) => <HomeIcon size={20} className={c} />}
        />
        <Item
          label="Map"
          active={active === "map"}
          onClick={() => onNavigate("map")}
          icon={(c) => <MapIcon size={20} className={c} />}
        />
        <Item
          label="Stats"
          active={active === "stats"}
          onClick={() => onNavigate("stats")}
          icon={(c) => <StatsIcon size={20} className={c} />}
        />
        <Item
          label="Settings"
          active={false}
          onClick={onSettings}
          icon={(c) => <SettingsIcon size={20} className={c} />}
        />
      </nav>
    </aside>
  );
}

function Item({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: (className: string) => React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-extrabold transition ${
        active
          ? "bg-accent-soft text-accent"
          : "text-[#8a93a0] hover:bg-[#f1e9db]"
      }`}
    >
      {icon("")}
      {label}
    </button>
  );
}
