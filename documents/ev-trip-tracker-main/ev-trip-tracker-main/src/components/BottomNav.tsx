"use client";

import {
  HomeIcon,
  MapIcon,
  PlusIcon,
  SettingsIcon,
  StatsIcon,
} from "@/components/icons";

export type NavScreen = "home" | "map" | "stats";

// Sticky bottom navigation. Five evenly-spaced slots keep the central add (+)
// button truly centered: Home · Map · (+) · Stats · Settings.
export function BottomNav({
  active,
  onNavigate,
  onAdd,
  onSettings,
}: {
  active: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onAdd: () => void;
  onSettings: () => void;
}) {
  return (
    <div className="lg:hidden sticky bottom-0 bg-cream/95 backdrop-blur-md border-t border-[#ece3d4] flex justify-around items-center pt-3 pb-[22px]">
      <NavButton
        label="Home"
        active={active === "home"}
        onClick={() => onNavigate("home")}
        icon={(c) => <HomeIcon className={c} />}
      />
      <NavButton
        label="Map"
        active={active === "map"}
        onClick={() => onNavigate("map")}
        icon={(c) => <MapIcon className={c} />}
      />

      <button
        onClick={onAdd}
        aria-label="Add charge"
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center -mt-[30px] shadow-[0_12px_26px_-6px_rgba(255,90,60,0.65)] active:scale-95 transition shrink-0"
      >
        <PlusIcon />
      </button>

      <NavButton
        label="Stats"
        active={active === "stats"}
        onClick={() => onNavigate("stats")}
        icon={(c) => <StatsIcon className={c} />}
      />
      <NavButton
        label="Settings"
        active={false}
        onClick={onSettings}
        icon={(c) => <SettingsIcon size={23} className={c} />}
      />
    </div>
  );
}

function NavButton({
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
  const color = active ? "text-accent" : "text-[#b6ac9c]";
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-[3px] w-16 ${color}`}
    >
      {icon("")}
      <div className="text-[10px] font-bold">{label}</div>
    </button>
  );
}
