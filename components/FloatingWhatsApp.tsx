"use client";

import { useState } from "react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = getWhatsAppLink(WHATSAPP_MESSAGES.general);

  return (
    <aside
      aria-label="WhatsApp live chat support"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group print:hidden select-none"
    >
      {/* Tooltip / Badge for Desktop */}
      <div
        className={`hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 bg-slate-900/95 backdrop-blur text-white text-xs font-bold rounded-2xl shadow-xl border border-slate-700/50 transition-all duration-300 pointer-events-none transform ${
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-2 scale-95"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Soft pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping -z-10 opacity-75" />

        {/* Official WhatsApp Vector Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.507 14.307c-.283-.141-1.674-.826-1.933-.92-.26-.094-.449-.141-.638.141-.189.283-.733.92-.9 1.109-.166.189-.333.213-.616.071-.283-.141-1.196-.441-2.278-1.406-.841-.751-1.409-1.679-1.574-1.963-.166-.283-.018-.437.123-.578.127-.127.283-.331.425-.496.141-.166.189-.283.283-.472.094-.189.047-.354-.024-.496-.071-.141-.638-1.536-.874-2.103-.23-.553-.464-.477-.638-.486-.165-.009-.354-.01-.543-.01-.189 0-.496.071-.755.354-.26.283-.992.969-.992 2.364 0 1.395 1.016 2.742 1.157 2.931.141.189 2.001 3.056 4.848 4.285.677.293 1.206.468 1.618.599.68.216 1.299.185 1.789.112.546-.082 1.674-.684 1.91-1.344.236-.66.236-1.226.166-1.344-.071-.118-.26-.189-.543-.33z" />
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.954.563 3.778 1.535 5.323L2.25 21.75l4.571-1.246a9.96 9.96 0 0 0 5.183 1.496c5.524 0 10.004-4.48 10.004-10.004C22.008 6.48 17.528 2 12.004 2zm0 18.204a8.17 8.17 0 0 1-4.225-1.173l-.303-.18-2.716.741.741-2.648-.197-.314A8.188 8.188 0 0 1 3.8 12.004C3.8 7.48 7.48 3.8 12.004 3.8c4.524 0 8.204 3.68 8.204 8.204 0 4.524-3.68 8.204-8.204 8.204z" />
        </svg>
      </a>
    </aside>
  );
}
