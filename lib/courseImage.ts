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
