import { notFound, redirect } from "next/navigation";
import PaymentForm from "@/components/PaymentForm";
import HowEnrollmentWorks from "@/components/HowEnrollmentWorks";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { matchInitialCourse, getCourseImage } from "@/lib/courseImage";
import { Course, Enrollment } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PaymentPageProps {
  params: {
    enrollmentId: string; // can be course.id (UUID or string), slug, or enrollment.id
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { enrollmentId } = params;

  // 1. Authentication check outside try/catch so Next.js redirect is never swallowed
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirectTo=/payment/${encodeURIComponent(enrollmentId)}`);
  }

  const supabase = createClient();

  // 2. Resolve the course from Supabase database or canonical catalog
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(enrollmentId);
  let dbCourse: any = null;

  try {
    if (isUuid) {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", enrollmentId)
        .maybeSingle();
      dbCourse = data;
    } else {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", enrollmentId)
        .maybeSingle();
      dbCourse = data;
    }

    // If still not found by direct id or slug, match via canonical catalog and query DB
    if (!dbCourse) {
      const catalogCandidate = matchInitialCourse(enrollmentId);
      const { data } = await supabase
        .from("courses")
        .select("*")
        .or(`slug.eq.${catalogCandidate.slug},title.ilike.%${catalogCandidate.title}%`)
        .limit(1)
        .maybeSingle();
      dbCourse = data;
    }
  } catch (err) {
    console.warn("Error fetching course for payment:", err);
  }

  // 3. Fallback to canonical catalog so course is always valid for all 5 programs
  const initialCatalog = matchInitialCourse(dbCourse?.slug || enrollmentId, dbCourse?.title);
  const course: Course = {
    ...initialCatalog,
    ...(dbCourse || {}),
    id: dbCourse?.id || initialCatalog.id,
    title: dbCourse?.title || initialCatalog.title,
    slug: dbCourse?.slug || initialCatalog.slug,
    thumbnail: getCourseImage(dbCourse || initialCatalog),
    price: 3999,
    original_price: 3999,
  };

  // 4. Check if student or admin already has an enrollment for this course
  let existingEnrollment: Enrollment | null = null;
  try {
    const { data: dbEnrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .or(`course_id.eq.${course.id},course_id.eq.${initialCatalog.id}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbEnrollment) {
      existingEnrollment = dbEnrollment;
    }
  } catch (err) {
    console.warn("Could not check existing enrollment:", err);
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <PaymentForm
          course={course}
          userEmail={user.email}
          userName={user.full_name}
          existingEnrollment={existingEnrollment}
        />
        <div className="border-t border-slate-200/80 pt-12">
          <HowEnrollmentWorks showCardWrapper={false} />
        </div>
      </div>
    </div>
  );
}
