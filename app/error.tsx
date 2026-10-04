"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Phone, HelpCircle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application runtime error (500):", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Error Badge & Icon */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Error 500 • Server Exception
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
            5<span className="text-red-500">0</span>0
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Something went wrong on our end
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            We encountered an unexpected server error while loading this page. Our technical team has been notified. You can try refreshing the page or head back to the dashboard.
          </p>

          {error?.digest && (
            <p className="text-xs font-mono text-slate-400 bg-slate-100 py-1.5 px-3 rounded-lg inline-block border border-slate-200">
              Error Reference ID: <span className="font-bold text-slate-600">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 border border-slate-200 font-extrabold text-sm rounded-xl shadow-sm hover:bg-slate-100 transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md hover:bg-slate-900 transition-all"
          >
            <Phone className="w-4 h-4" />
            Report Issue
          </Link>
        </div>

        {/* Troubleshooting Tips Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left text-xs text-slate-600 space-y-2.5">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
            Quick Troubleshooting Tips:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-500 font-medium">
            <li>Try refreshing the page or clearing your browser cache.</li>
            <li>If you were completing an enrollment or payment, check your account in the dashboard.</li>
            <li>If the issue persists, our support team is available via email and WhatsApp.</li>
          </ul>
        </div>

        {/* Footer Support Link */}
        <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>Need immediate assistance?</span>
          <Link href="/faq" className="font-extrabold text-brand-blue hover:underline inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Check FAQs
          </Link>
        </div>

      </div>
    </div>
  );
}
