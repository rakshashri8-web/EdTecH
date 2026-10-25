import { INITIAL_COURSES } from "@/lib/data";
import { Course } from "@/lib/types";

/**
 * Centralized Course Artwork Resolution
 * Maps any course representation (slug, id, title) strictly to the 5 local 493x266 artwork images.
 * Prevents loading slow external Unsplash placeholders.
 */

const EXACT_MAP: Record<string, string> = {
  // Slugs
  "data-analyst": "/images/courses/data_analyst_493x266(2).png",
  "data-analytics": "/images/courses/data_analyst_493x266(2).png",
  "data-analytics-career-track": "/images/courses/data_analyst_493x266(2).png",
  "data-science": "/images/courses/data_science_493x266(2).png",
  "data-science-machine-learning": "/images/courses/data_science_493x266(2).png",
  "ai-ml-engineer": "/images/courses/ai_ml_493x266(2).png",
  "ai-ml": "/images/courses/ai_ml_493x266(2).png",
  "ai-ml-engineering-mastery": "/images/courses/ai_ml_493x266(2).png",
  "genai-engineer": "/images/courses/gen_ai_493x266(2).png",
  "generative-ai": "/images/courses/gen_ai_493x266(2).png",
  "generative-ai-engineer": "/images/courses/gen_ai_493x266(2).png",
  "agentic-ai-engineer": "/images/courses/agentic_ai_493x266(2).png",
  "agentic-ai": "/images/courses/agentic_ai_493x266(2).png",

  // Course IDs
  "course-1": "/images/courses/data_analyst_493x266(2).png",
  "course-2": "/images/courses/data_science_493x266(2).png",
  "course-3": "/images/courses/ai_ml_493x266(2).png",
  "course-4": "/images/courses/gen_ai_493x266(2).png",
  "course-5": "/images/courses/agentic_ai_493x266(2).png",
  "a0000000-0000-0000-0000-000000000001": "/images/courses/data_analyst_493x266(2).png",
  "a0000000-0000-0000-0000-000000000002": "/images/courses/data_science_493x266(2).png",
  "a0000000-0000-0000-0000-000000000003": "/images/courses/ai_ml_493x266(2).png",
  "a0000000-0000-0000-0000-000000000004": "/images/courses/gen_ai_493x266(2).png",
  "a0000000-0000-0000-0000-000000000005": "/images/courses/agentic_ai_493x266(2).png",
};

export function getCourseImage(course?: { id?: string; slug?: string; title?: string; thumbnail?: string } | null): string {
  if (!course) return "/images/courses/data_analyst_493x266(2).png";

  const slug = (course.slug || "").toLowerCase().trim();
  const id = (course.id || "").toLowerCase().trim();

  // Fast exact match
  if (slug && EXACT_MAP[slug]) return EXACT_MAP[slug];
  if (id && EXACT_MAP[id]) return EXACT_MAP[id];

  const title = (course.title || "").toLowerCase();
  const combined = `${slug} ${id} ${title}`;

  // 1. Agentic AI
  if (combined.includes("agent")) {
    return "/images/courses/agentic_ai_493x266(2).png";
  }

  // 2. Generative AI
  if (
    combined.includes("genai") ||
    combined.includes("gen-ai") ||
    combined.includes("generative") ||
    combined.includes("course-4")
  ) {
    return "/images/courses/gen_ai_493x266(2).png";
  }

  // 3. Data Science (check before generic AI/ML when "data science" is in title)
  if (
    combined.includes("data science") ||
    combined.includes("data-science") ||
    combined.includes("course-2")
  ) {
    return "/images/courses/data_science_493x266(2).png";
  }

  // 4. AI / ML Engineering
  if (
    combined.includes("ai-ml") ||
    combined.includes("ai / ml") ||
    combined.includes("ai & ml") ||
    combined.includes("course-3") ||
    (combined.includes("ai") && combined.includes("ml")) ||
    combined.includes("engineering mastery")
  ) {
    return "/images/courses/ai_ml_493x266(2).png";
  }

  // 5. Data Analyst
  if (
    combined.includes("analyst") ||
    combined.includes("analytics") ||
    combined.includes("data-analyst") ||
    combined.includes("course-1")
  ) {
    return "/images/courses/data_analyst_493x266(2).png";
  }

  // If already pointing to local course images
  if (course.thumbnail && course.thumbnail.startsWith("/images/courses/")) {
    return course.thumbnail;
  }

  return "/images/courses/data_analyst_493x266(2).png";
}

/**
 * Maps any course identifier or database title to its corresponding complete
 * curriculum (10 modules, 40 lessons, real-world projects) in INITIAL_COURSES.
 */
export function matchInitialCourse(identifier?: string, title?: string): Course {
  const query = `${identifier || ""} ${title || ""}`.toLowerCase().trim();

  // 1. Exact match by slug, ID, or title
  const exact = INITIAL_COURSES.find(
    (c) =>
      c.slug === identifier ||
      c.id === identifier ||
      c.title.toLowerCase() === (title || "").toLowerCase()
  );
  if (exact) return exact;

  // 2. Keyword match
  if (query.includes("agent")) {
    return INITIAL_COURSES.find((c) => c.slug === "agentic-ai-engineer") || INITIAL_COURSES[4];
  }
  if (
    query.includes("genai") ||
    query.includes("gen-ai") ||
    query.includes("generative") ||
    query.includes("course-4")
  ) {
    return INITIAL_COURSES.find((c) => c.slug === "genai-engineer") || INITIAL_COURSES[3];
  }
  if (
    query.includes("data science") ||
    query.includes("data-science") ||
    query.includes("course-2")
  ) {
    return INITIAL_COURSES.find((c) => c.slug === "data-science") || INITIAL_COURSES[1];
  }
  if (
    query.includes("ai-ml") ||
    query.includes("ai / ml") ||
    query.includes("ai & ml") ||
    query.includes("mastery") ||
    query.includes("course-3") ||
    (query.includes("ai") && query.includes("ml"))
  ) {
    return INITIAL_COURSES.find((c) => c.slug === "ai-ml-engineer") || INITIAL_COURSES[2];
  }
  if (
    query.includes("analyst") ||
    query.includes("analytics") ||
    query.includes("course-1")
  ) {
    return INITIAL_COURSES.find((c) => c.slug === "data-analyst") || INITIAL_COURSES[0];
  }

  return INITIAL_COURSES[0];
}
