import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "admin" | "super_admin";
  avatar_url?: string | null;
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin" || user?.role === "super_admin";
}

export function isSuperAdmin(user: AuthUser | null): boolean {
  return user?.role === "super_admin";
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch profile role and metadata from Supabase profiles table (or fallback to user_metadata)
    let profile: any = null;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      profile = data;
    } catch {
      // Profile query error fallback
    }

    const isSuperAdminEmail = user.email?.toLowerCase() === "rakshashri8@gmail.com";
    const resolvedRole = (isSuperAdminEmail
      ? "super_admin"
      : (profile?.role || (user.user_metadata?.role as any) || (user.app_metadata?.role as any) || "student")) as "student" | "admin" | "super_admin";

    // If profile.full_name is missing or placeholder 'Student', use user_metadata name
    let resolvedName = profile?.full_name;
    if (!resolvedName || resolvedName === "Student" || resolvedName === "student") {
      resolvedName = user.user_metadata?.full_name || user.user_metadata?.name || (isSuperAdminEmail ? "Shri Raksha" : user.email?.split("@")[0]) || "Student";
    }

    const resolvedAvatar = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    return {
      id: user.id,
      email: user.email || "",
      full_name: resolvedName,
      role: resolvedRole,
      avatar_url: resolvedAvatar,
    };
  } catch (err: any) {
    if (err && typeof err === "object" && err.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}
