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

    // Fetch profile role and metadata from Supabase profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
      role: profile?.role || "student",
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    };
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}
