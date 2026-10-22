import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enrollmentId, action, reason } = await request.json();

    if (!enrollmentId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const supabase = createClient();

    const newStatus = action === "approve" ? "approved" : "rejected";

    const updateData: Record<string, any> = {
      status: newStatus,
    };

    if (action === "approve") {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user.id;
    } else {
      updateData.approved_at = null;
      updateData.rejection_reason = reason ?? null;
    }

    const { error: enrollErr } = await supabase
      .from("enrollments")
      .update(updateData)
      .eq("id", enrollmentId);

    if (enrollErr) throw enrollErr;

    // Also update payments table if it exists
    try {
      await supabase
        .from("payments")
        .update({
          status: action === "approve" ? "completed" : "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("enrollment_id", enrollmentId);
    } catch {
      // payments table may not exist — non-fatal
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    console.error("Payment PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
