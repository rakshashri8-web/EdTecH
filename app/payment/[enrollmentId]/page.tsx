import { notFound, redirect } from "next/navigation";
import PaymentForm from "@/components/PaymentForm";
import HowEnrollmentWorks from "@/components/HowEnrollmentWorks";
import { INITIAL_COURSES } from "@/lib/data";
import { Course, Enrollment } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PaymentPageProps {
  params: {
    enrollmentId: string; // can be course.id or enrollment.id or course slug
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { enrollmentId } = params;

  let course: Course | null = INITIAL_COURSES.find(
    (c) => c.id === enrollmentId || c.slug === enrollmentId
  ) || null;

  let userEmail = "";
  let userName = "";
  let existingEnrollment: Enrollment | null = null;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect(`/login?redirectTo=/payment/${enrollmentId}`);
    }

    userEmail = user.email || "";
    userName = user.user_metadata?.full_name || user.user_metadata?.name || "";

    // Fetch course from DB
    const { data: dbCourse } = await supabase
      .from("courses")
      .select("*")
      .or(`id.eq.${enrollmentId},slug.eq.${enrollmentId}`)
      .single();

    if (dbCourse) {
      course = dbCourse;
    }

    if (course) {
      // Check if user already submitted enrollment for this course
      const { data: dbEnrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (dbEnrollment) {
        existingEnrollment = dbEnrollment;
      }
    }
  } catch {
    // Handle unauthenticated redirect
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <PaymentForm
          course={course}
          userEmail={userEmail}
          userName={userName}
          existingEnrollment={existingEnrollment}
        />
        <div className="border-t border-slate-200/80 pt-12">
          <HowEnrollmentWorks showCardWrapper={false} />
        </div>
      </div>
    </div>
  );
}
