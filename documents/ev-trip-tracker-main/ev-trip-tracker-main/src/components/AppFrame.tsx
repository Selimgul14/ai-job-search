import type { ReactNode } from "react";

// Centered panel for the form pages. Phone-width column on mobile; on desktop a
// comfortable, rounded card with breathing room rather than a full-height strip.
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-sand flex justify-center text-ink sm:py-8">
      <div className="w-full max-w-[460px] min-h-screen bg-cream relative flex flex-col shadow-[0_0_70px_rgba(70,45,20,0.10)] sm:max-w-2xl sm:min-h-0 sm:rounded-[28px] sm:shadow-[0_20px_60px_-24px_rgba(70,45,20,0.35)]">
        {children}
      </div>
    </div>
  );
}
