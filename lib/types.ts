export type UserRole = 'student' | 'admin';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';
export type CourseCategory = 'Data' | 'AI & ML' | 'Generative AI' | 'Agentic AI';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  price: number;
  original_price: number;
  thumbnail: string;
  instructor_name: string;
  instructor_role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  published: boolean;
  modules_count?: number;
  projects_count?: number;
  technologies?: string[];
  outcomes?: string[];
  prerequisites?: string[];
  target_audience?: string[];
  created_at?: string;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string;
  order: number;
  is_preview: boolean;
  completed?: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  name: string;
  phone: string;
  email: string;
  amount: number;
  utr: string;
  screenshot_url: string;
  status: EnrollmentStatus;
  created_at: string;
  approved_at: string | null;
  course?: Course;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  course?: Course;
  profile?: Profile;
}

export interface AssessmentQuestion {
  id: string;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProjectItem {
  id: number;
  slug: string;
  name: string;
  course: string;
  course_slug: string;
  project_order: number;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  problem_statement: string;
  real_world_use_case: string;
  required_modules: string[];
  technologies: string[];
  build_requirements: string[];
  assessment_questions: AssessmentQuestion[];
}

export interface ProjectSubmission {
  id?: string;
  user_id: string;
  project_id: number;
  course_id?: string;
  github_url: string;
  demo_url?: string;
  explanation: string;
  submitted_at?: string;
}

export interface ProjectAssessment {
  id?: string;
  user_id: string;
  project_id: number;
  course_id?: string;
  score: number;
  score_breakdown: {
    projectUnderstanding: number;
    technologyKnowledge: number;
    moduleKnowledge: number;
    codeSnippetAnalysis: number;
    decisionMaking: number;
    debugging: number;
    ownWordsExplanation: number;
  };
  status: 'passed' | 'review_recommended';
  answers: Record<string, number | string>;
  completed_at?: string;
}

export interface LearningStage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  skills: string[];
  technologies: string[];
  relatedCourses: string[];
  projects: string[];
  prerequisites: string[];
  outcomes: string[];
}
