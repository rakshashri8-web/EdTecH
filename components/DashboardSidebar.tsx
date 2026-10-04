"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Layers, Award, CreditCard, Settings } from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/dashboard#my-courses", icon: BookOpen },
    { name: "Learning Path", href: "/#learning-path", icon: Layers },
    { name: "Certificates", href: "/completed", icon: Award },
    { name: "Payments", href: "/dashboard#payments", icon: CreditCard },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2 shrink-0">
      <div className="px-3 py-2 text-xs font-black text-slate-400 uppercase tracking-wider">
        Student Menu
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              isActive
                ? "bg-brand-blue/10 text-brand-blue font-extrabold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-brand-blue" : "text-slate-400"}`} />
            {link.name}
          </Link>
        );
      })}
    </aside>
  );
}
