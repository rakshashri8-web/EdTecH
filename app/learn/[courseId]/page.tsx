import { notFound, redirect } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { INITIAL_COURSES } from "@/lib/data";
import { matchInitialCourse, getCourseImage } from "@/lib/courseImage";
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

  // Always match to standard 5-track catalog
  const initialCourse = matchInitialCourse(courseId);

  let course: Course = { ...initialCourse };
  let modules: CourseModule[] = initialCourse.modules || [];
  let userProgress: string[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    // Fetch course from DB safely checking UUID format or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
    let dbCourseQuery = supabase.from("courses").select("*");
    if (isUuid) {
      dbCourseQuery = dbCourseQuery.eq("id", courseId);
    } else {
      dbCourseQuery = dbCourseQuery.or(`slug.eq.${courseId},slug.eq.${initialCourse.slug}`);
    }
    const { data: dbCourse } = await dbCourseQuery.limit(1).maybeSingle();

    if (dbCourse) {
      const matchedCatalog = matchInitialCourse(dbCourse.slug || courseId, dbCourse.title);
      course = {
        ...matchedCatalog,
        ...dbCourse,
        thumbnail: getCourseImage(dbCourse),
        modules: matchedCatalog.modules || [],
      } as Course;
    }

    if (!course) {
      notFound();
    }

    // STRICT UNLOCK CHECK: Super Admin and Admins have full access to all courses without enrolling/paying
    const isSuperAdminEmail = user.email?.toLowerCase() === "rakshashri8@gmail.com";
    const isStaff = isAdmin(user) || isSuperAdminEmail || user.role === "admin" || user.role === "super_admin";

    const validCourseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(course.id)
      ? course.id
      : (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(dbCourse?.id) ? dbCourse.id : null);

    if (!isStaff) {
      if (validCourseUuid) {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("status")
          .eq("user_id", user.id)
          .eq("course_id", validCourseUuid)
          .maybeSingle();

        // If enrollment is missing, pending, or rejected -> redirect to payment page!
        if (!enrollment || enrollment.status !== "approved") {
          redirect(`/payment/${course.slug || course.id}`);
        }
      } else {
        redirect(`/payment/${course.slug || course.id}`);
      }
    }

    // Fetch modules and lessons from DB if available
    if (validCourseUuid) {
      const { data: dbModules } = await supabase
        .from("course_modules")
        .select("*, lessons(*)")
        .eq("course_id", validCourseUuid)
        .order("order", { ascending: true });

      if (dbModules && dbModules.length > 0 && dbModules.some((m: any) => m.lessons && m.lessons.length > 0)) {
        modules = dbModules;
      } else {
        modules = initialCourse.modules || [];
      }
    } else {
      modules = initialCourse.modules || [];
    }

    // Fetch user progress
    if (validCourseUuid) {
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("course_id", validCourseUuid)
        .eq("completed", true);

      if (progressData) {
        userProgress = progressData.map((p) => p.lesson_id);
      }
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
  if (!modules || modules.length === 0) {
    modules = initialCourse.modules || [];
  }

  // Merge any video URL and duration overrides from lesson_videos table
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    let videoOverrides: any[] = [];
    try {
      const { data, error } = await supabase
        .from("lesson_videos")
        .select("lesson_id, video_url, duration");
      if (!error && data) {
        videoOverrides = data;
      } else {
        const { data: fallbackData } = await supabase
          .from("lesson_videos")
          .select("lesson_id, video_url");
        videoOverrides = fallbackData || [];
      }
    } catch {}

    if (videoOverrides && videoOverrides.length > 0) {
      const overrideMap = new Map<string, { video_url?: string; duration?: string }>();
      for (const v of videoOverrides) {
        if (v.lesson_id && !v.lesson_id.startsWith("SYSTEM_")) {
          overrideMap.set(v.lesson_id, {
            video_url: v.video_url,
            duration: v.duration,
          });
        }
      }

      modules = modules.map((m) => ({
        ...m,
        lessons: (m.lessons || []).map((l) => {
          const override = overrideMap.get(l.id);
          let videoUrl = (override?.video_url ?? l.video_url ?? "").trim();
          let duration = (override?.duration ?? l.duration ?? "").trim();
          if (videoUrl.includes("dQw4w9WgXcQ")) {
            videoUrl = "";
            duration = "";
          }
          if (!videoUrl) {
            duration = "";
          }
          return {
            ...l,
            video_url: videoUrl,
            duration: duration,
          };
        }),
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
