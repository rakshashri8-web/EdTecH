"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-colors"
    >
      <Printer className="w-4 h-4" /> Print / Save as PDF
    </button>
  );
}
