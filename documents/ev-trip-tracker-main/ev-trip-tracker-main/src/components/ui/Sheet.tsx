"use client";

import type { ReactNode } from "react";

// Bottom sheet on mobile; centered modal dialog on desktop (sm+).
export function Sheet({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center sm:p-6">
      {/* scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(22,49,74,0.42)]"
      />
      {/* panel */}
      <div className="no-scrollbar relative w-full max-w-[460px] max-h-[94vh] overflow-y-auto bg-cream rounded-t-[26px] shadow-[0_-12px_44px_rgba(0,0,0,0.22)] animate-sheet-up sm:max-w-[480px] sm:max-h-[86vh] sm:rounded-[26px] sm:shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:animate-modal-pop">
        {/* drag handle (mobile only) */}
        <div className="sticky top-0 bg-cream pt-3 pb-1 flex justify-center z-[2] sm:hidden">
          <div className="w-[42px] h-[5px] rounded-[3px] bg-[#ddd2c0]" />
        </div>
        {children}
      </div>
    </div>
  );
}
