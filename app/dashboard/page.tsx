import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Enrollment, ProjectAssessment, Certificate, Course } from "@/lib/types";
import { INITIAL_COURSES } from "@/lib/data";
import DashboardContent from "@/components/DashboardContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard — AIMP",
  description: "Track your enrolled courses, 5-stage learning path, project assessment scores, verified certificates, and UPI payments.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let enrollments: Enrollment[] = [];
  let userProgress: { course_id: string; lesson_id: string }[] = [];
  let userAssessments: ProjectAssessment[] = [];
  let certificates: (Certificate & { course?: Course })[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    // Fetch student's actual enrollments from Supabase
    const { data: enrollData } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (enrollData) {
      enrollments = enrollData.map((enr) => {
        if (!enr.course) {
          const fallbackCourse = INITIAL_COURSES.find(
            (c) => c.id === enr.course_id || c.slug === enr.course_id
          );
          if (fallbackCourse) {
            return { ...enr, course: fallbackCourse };
          }
        }
        return enr;
      });
    }

    // Fetch student's actual lesson progress
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("course_id, lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true);

    if (progressData) {
      userProgress = progressData;
    }

    // Fetch student's project assessments
    const { data: assessmentData } = await supabase
      .from("project_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (assessmentData) {
      userAssessments = assessmentData;
    }

    // Fetch student's certificates
    const { data: certData } = await supabase
      .from("certificates")
      .select("*, course:courses(*)")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (certData) {
      certificates = certData.map((cert) => {
        if (!cert.course) {
          const fallbackCourse = INITIAL_COURSES.find(
            (c) => c.id === cert.course_id || c.slug === cert.course_id
          );
          if (fallbackCourse) {
            return { ...cert, course: fallbackCourse };
          }
        }
        return cert;
      });
    }
  } catch (err) {
    console.error("Dashboard data fetching error:", err);
  }

  return (
    <DashboardContent
      user={user}
      enrollments={enrollments}
      userProgress={userProgress}
      userAssessments={userAssessments}
      certificates={certificates}
    />
  );
}
