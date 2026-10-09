import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "admin";
  avatar_url?: string | null;
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

    return {
      id: user.id,
      email: user.email || "",
      full_name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student",
      role: profile?.role || (user.user_metadata?.role as any) || (user.app_metadata?.role as any) || "student",
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    };
  } catch (err: any) {
    if (err && typeof err === "object" && err.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}
