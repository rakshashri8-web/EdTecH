"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Menu, X, User, LogOut, LayoutDashboard, CheckCircle2, ShieldCheck, Layers, HelpCircle, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";

interface NavbarProps {
  initialUser?: {
    id: string;
    email: string;
    full_name: string;
    role: "student" | "admin" | "super_admin";
    avatar_url?: string | null;
  } | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [userProfile, setUserProfile] = useState<Profile | null>(() => {
    if (initialUser) {
      return {
        id: initialUser.id,
        email: initialUser.email,
        full_name: initialUser.full_name,
        role: initialUser.role,
        avatar_url: initialUser.avatar_url || null,
        phone: null,
        created_at: new Date().toISOString(),
      };
    }
    return null;
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (initialUser) {
      setUserProfile({
        id: initialUser.id,
        email: initialUser.email,
        full_name: initialUser.full_name,
        role: initialUser.role,
        avatar_url: initialUser.avatar_url || null,
        phone: null,
        created_at: new Date().toISOString(),
      });
      setIsLoading(false);
    }
  }, [initialUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUserProfile = async (user: any) => {
      try {
        // Only fetch the profile row if we don't already have full data from the server
        // This avoids an extra Supabase query on every client-side navigation
        const isSuperAdmin = user.email?.toLowerCase() === "rakshashri8@gmail.com";
        let resolvedName = user.user_metadata?.full_name || user.user_metadata?.name || (isSuperAdmin ? "Shri Raksha" : user.email?.split("@")[0]) || "Student";
        let resolvedAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
        let resolvedRole: "student" | "admin" | "super_admin" = isSuperAdmin ? "super_admin" : (user.user_metadata?.role || "student");

        // Fetch profile only once — when we genuinely don't know the role or name
        if (!isSuperAdmin) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, role")
            .eq("id", user.id)
            .maybeSingle();

          if (profile) {
            if (profile.full_name && profile.full_name !== "Student") {
              resolvedName = profile.full_name;
            }
            if (profile.avatar_url) resolvedAvatar = profile.avatar_url;
            if (profile.role) resolvedRole = profile.role;

            // Background sync: update placeholder name/avatar in DB
            if (
              (profile.full_name === "Student" || !profile.full_name || !profile.avatar_url) &&
              (resolvedName !== "Student" || resolvedAvatar)
            ) {
              supabase
                .from("profiles")
                .update({
                  full_name: resolvedName,
                  ...(resolvedAvatar ? { avatar_url: resolvedAvatar } : {}),
                })
                .eq("id", user.id)
                .then(() => {});
            }
          }
        }

        setUserProfile({
          id: user.id,
          email: user.email || "",
          full_name: resolvedName,
          phone: null,
          avatar_url: resolvedAvatar,
          role: resolvedRole,
          created_at: new Date().toISOString(),
        });
      } catch {
        const isSuperAdmin = user.email?.toLowerCase() === "rakshashri8@gmail.com";
        const resolvedName = user.user_metadata?.full_name || user.user_metadata?.name || (isSuperAdmin ? "Shri Raksha" : user.email?.split("@")[0]) || "Student";
        const resolvedAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
        setUserProfile({
          id: user.id,
          email: user.email || "",
          full_name: resolvedName,
          phone: null,
          avatar_url: resolvedAvatar,
          role: isSuperAdmin ? "super_admin" : "student",
          created_at: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    // If initialUser was not supplied, fetch active session
    if (!initialUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUserProfile(null);
        setIsLoading(false);
      } else if (event === "SIGNED_IN" && session?.user && !initialUser) {
        // Only sync if we didn't already get user data from the server (SSR)
        await syncUserProfile(session.user);
      } else if (event === "INITIAL_SESSION" && !initialUser) {
        if (session?.user) {
          await syncUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, initialUser?.id]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Fallback
    }
    setUserProfile(null);
    setUserDropdownOpen(false);
    router.refresh();
    window.location.href = "/";
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Learning Path", href: "/learning-path" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Completed", href: "/completed" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-border" : "bg-white/80 backdrop-blur-sm border-b border-brand-border/60"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-blue/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-dark">
              AIMP
            </span>
          </Link>

          {/* Desktop Nav Links with Precise Active Highlighting */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/70 rounded-full border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-brand-blue shadow-sm font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full border border-brand-border hover:bg-slate-50 transition-colors"
                >
                  {userProfile.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.full_name || "User Avatar"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                      {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 pr-2">
                    {userProfile.full_name || "Student"}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{userProfile.email}</p>
                      {(userProfile.role === "admin" || userProfile.role === "super_admin") && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800">
                          <ShieldCheck className="w-3 h-3" /> {userProfile.role === "super_admin" ? "Super Admin" : "Admin"}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/completed"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      My Certificates
                    </Link>
                    {(userProfile.role === "admin" || userProfile.role === "super_admin") && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Approval Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="w-28 h-9 bg-slate-100 animate-pulse rounded-xl" />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-brand-blue border border-slate-200 rounded-xl hover:border-brand-blue/40 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-xl shadow-md shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/30 transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {userProfile && (
              <Link
                href="/dashboard"
                className="p-0.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Go to Dashboard"
              >
                {userProfile.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                    {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-border px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto shadow-xl">
          {/* User Profile Card when logged in */}
          {userProfile && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-3 space-y-2.5">
              <div className="flex items-center gap-3">
                {userProfile.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                    {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {userProfile.full_name || "Student"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{userProfile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-700 hover:text-brand-blue shadow-xs"
                >
                  Dashboard
                </Link>
                <Link
                  href="/completed"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-700 hover:text-brand-blue shadow-xs"
                >
                  Certificates
                </Link>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-extrabold transition-colors ${
                  isActive ? "bg-blue-50 text-brand-blue font-black" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {(userProfile?.role === "admin" || userProfile?.role === "super_admin") && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-amber-800 bg-amber-50 border border-amber-200/60"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isLoading ? (
              <div className="w-full h-10 bg-slate-100 animate-pulse rounded-xl" />
            ) : userProfile ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Log out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-extrabold text-slate-700 border border-slate-200 hover:border-brand-blue rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-xl shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
