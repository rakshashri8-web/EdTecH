"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Layers, Award, CreditCard } from "lucide-react";

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  enrolledCount?: number;
  pendingCount?: number;
  certificatesCount?: number;
}

export default function DashboardSidebar({
  activeTab = "overview",
  onTabChange,
  enrolledCount = 0,
  pendingCount = 0,
  certificatesCount = 0,
}: DashboardSidebarProps) {
  const tabs = [
    { 
      id: "overview", 
      name: "Dashboard", 
      href: "/dashboard#overview", 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: "my-courses", 
      name: "My Courses", 
      href: "/dashboard#my-courses", 
      icon: BookOpen,
      badge: enrolledCount > 0 ? enrolledCount : null
    },
    { 
      id: "learning-path", 
      name: "Learning Path", 
      href: "/dashboard#learning-path", 
      icon: Layers,
      badge: "5 Stages"
    },
    { 
      id: "certificates", 
      name: "Certificates", 
      href: "/dashboard#certificates", 
      icon: Award,
      badge: certificatesCount > 0 ? certificatesCount : null
    },
    { 
      id: "payments", 
      name: "Payments", 
      href: "/dashboard#payments", 
      icon: CreditCard,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: pendingCount > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2 shrink-0">
      <div className="px-3 py-2 text-xs font-black text-slate-400 uppercase tracking-wider">
        Student Menu
      </div>
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          const handleClick = (e: React.MouseEvent) => {
            if (onTabChange) {
              e.preventDefault();
              onTabChange(tab.id);
            }
          };

          return (
            <button
              key={tab.id}
              onClick={handleClick}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left ${
                isActive
                  ? "bg-brand-blue/10 text-brand-blue font-extrabold shadow-sm shadow-brand-blue/5 border border-brand-blue/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-brand-blue" : "text-slate-400"}`} />
                <span>{tab.name}</span>
              </div>

              {tab.badge && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  tab.badgeColor || (isActive ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600")
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
