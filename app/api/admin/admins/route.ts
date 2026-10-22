import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";

// POST: Grant admin role to a user by email (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isSuperAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized — Super Admin only" }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createClient();

    // Find the user by email in profiles
    const { data: targetProfile, error: findErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findErr) throw findErr;

    if (!targetProfile) {
      return NextResponse.json({ error: "No user found with that email address." }, { status: 404 });
    }

    if (targetProfile.role === "super_admin") {
      return NextResponse.json({ error: "Cannot modify a super_admin's role." }, { status: 403 });
    }

    const { data, error: updateErr } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", targetProfile.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error("Grant admin error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Revoke admin role (super_admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isSuperAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized — Super Admin only" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Cannot revoke yourself
    if (userId === user.id) {
      return NextResponse.json({ error: "Cannot revoke your own admin role." }, { status: 403 });
    }

    const supabase = createClient();

    // Guard: cannot revoke super_admin
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (targetProfile?.role === "super_admin") {
      return NextResponse.json({ error: "Cannot revoke a super_admin's role." }, { status: 403 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: "student" })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Revoke admin error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
