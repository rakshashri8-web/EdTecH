import { notFound, redirect } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { INITIAL_COURSES } from "@/lib/data";
import { Course, CourseModule } from "@/lib/types";

export const dynamic = "force-dynamic";

interface LearnPageProps {
  params: {
    courseId: string;
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { courseId } = params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirectTo=/learn/${courseId}`);
  }

  // First find in INITIAL_COURSES
  const initialCourse = INITIAL_COURSES.find(
    (c) => c.id === courseId || c.slug === courseId
  ) || null;

  let course: Course | null = initialCourse;
  let modules: CourseModule[] = [];
  let userProgress: string[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    // Fetch course from DB safely checking UUID format
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
    let dbCourseQuery = supabase.from("courses").select("*");
    if (isUuid) {
      dbCourseQuery = dbCourseQuery.eq("id", courseId);
    } else {
      dbCourseQuery = dbCourseQuery.eq("slug", courseId);
    }
    const { data: dbCourse } = await dbCourseQuery.maybeSingle();

    if (dbCourse) {
      // Find matching catalog course by title or slug if initialCourse wasn't found by courseId
      const matchedCatalog = initialCourse || INITIAL_COURSES.find(
        (c) => c.slug === dbCourse.slug || c.title.toLowerCase() === dbCourse.title?.toLowerCase()
      );

      course = {
        ...(matchedCatalog || {}),
        ...dbCourse,
        modules: matchedCatalog?.modules || course?.modules || [],
      } as Course;
    }

    if (!course) {
      notFound();
    }

    // STRICT UNLOCK CHECK: Super Admin and Admins have full access to all courses without enrolling/paying
    const isSuperAdminEmail = user.email?.toLowerCase() === "rakshashri8@gmail.com";
    const isStaff = isAdmin(user) || isSuperAdminEmail || user.role === "admin" || user.role === "super_admin";

    if (!isStaff) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("status")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .maybeSingle();

      // If enrollment is missing, pending, or rejected -> redirect to payment page!
      if (!enrollment || enrollment.status !== "approved") {
        redirect(`/payment/${course.id}`);
      }
    }

    // Fetch modules and lessons from DB if available
    const { data: dbModules } = await supabase
      .from("course_modules")
      .select("*, lessons(*)")
      .eq("course_id", course.id)
      .order("order", { ascending: true });

    if (dbModules && dbModules.length > 0) {
      modules = dbModules;
    }

    // Fetch user progress
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("completed", true);

    if (progressData) {
      userProgress = progressData.map((p) => p.lesson_id);
    }

  } catch (err: any) {
    // If redirect was thrown, rethrow it
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  if (!course) {
    notFound();
  }

  // Use full 10 modules from catalog if DB modules table is empty
  if (modules.length === 0) {
    if (course.modules && course.modules.length > 0) {
      modules = course.modules;
    }
  }

  // Merge any video URL overrides from lesson_videos table
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data: videoOverrides } = await supabase
      .from("lesson_videos")
      .select("lesson_id, video_url");

    if (videoOverrides && videoOverrides.length > 0) {
      const overrideMap = new Map(videoOverrides.map((v: any) => [v.lesson_id, v.video_url]));
      modules = modules.map((m) => ({
        ...m,
        lessons: (m.lessons || []).map((l) => ({
          ...l,
          video_url: overrideMap.get(l.id) || l.video_url,
        })),
      }));
    }
  } catch {}

  return (
    <LessonPlayer
      course={course}
      modules={modules}
      initialProgress={userProgress}
    />
  );
}
