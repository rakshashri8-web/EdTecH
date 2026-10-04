import { notFound, redirect } from "next/navigation";
import LessonPlayer from "@/components/LessonPlayer";
import { getCurrentUser } from "@/lib/auth";
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

  let course: Course | null = INITIAL_COURSES.find(
    (c) => c.id === courseId || c.slug === courseId
  ) || null;

  let modules: CourseModule[] = [];
  let userProgress: string[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    // Fetch course
    const { data: dbCourse } = await supabase
      .from("courses")
      .select("*")
      .or(`id.eq.${courseId},slug.eq.${courseId}`)
      .single();

    if (dbCourse) {
      course = dbCourse;
    }

    if (!course) {
      notFound();
    }

    // STRICT UNLOCK CHECK: Allow if user is admin OR has approved enrollment
    if (user.role !== "admin") {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("status")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single();

      // If enrollment is missing, pending, or rejected -> redirect to payment page!
      if (!enrollment || enrollment.status !== "approved") {
        redirect(`/payment/${course.id}`);
      }
    }

    // Fetch modules and lessons
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

  // Fallback modules if DB modules not yet seeded
  if (modules.length === 0) {
    modules = [
      {
        id: "mod-1",
        course_id: course.id,
        title: "Module 1: Computational & Theoretical Foundation",
        description: "Core syntax, data structures, and environmental setup.",
        order: 1,
        lessons: [
          {
            id: "les-1",
            module_id: "mod-1",
            course_id: course.id,
            title: "Lesson 1.1: Program Overview & Python Environment",
            description: "Setting up VS Code, virtual environments, and Jupyter notebooks.",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "15 mins",
            order: 1,
            is_preview: true,
          },
          {
            id: "les-2",
            module_id: "mod-1",
            course_id: course.id,
            title: "Lesson 1.2: Variables, Data Types & Control Logic",
            description: "Lists, dictionaries, conditionals, and loops.",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "22 mins",
            order: 2,
            is_preview: false,
          }
        ]
      },
      {
        id: "mod-2",
        course_id: course.id,
        title: "Module 2: Practical Projects & Capstone Implementation",
        description: "Hands-on projects and production code building.",
        order: 2,
        lessons: [
          {
            id: "les-3",
            module_id: "mod-2",
            course_id: course.id,
            title: "Lesson 2.1: Building Production-Grade Pipelines",
            description: "Structuring clean modular code and handling exceptions.",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "30 mins",
            order: 1,
            is_preview: false,
          }
        ]
      }
    ];
  }

  return (
    <LessonPlayer
      course={course}
      modules={modules}
      initialProgress={userProgress}
    />
  );
}
