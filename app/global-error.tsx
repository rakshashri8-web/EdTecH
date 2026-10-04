"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical root application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Application Exception</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              A critical error occurred while initializing the application layout.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/60">
                Reference: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
            <Link
              href="/"
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
