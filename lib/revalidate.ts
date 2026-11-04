import { revalidatePath } from "next/cache";

/**
 * Revalidate all course pages across public and admin portals
 * whenever a course is created, updated, published, or deleted.
 */
export function revalidateCoursePages() {
  try {
    revalidatePath("/courses");
    revalidatePath("/courses/[slug]", "page");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/courses");
    revalidatePath("/admin/videos");
  } catch (err) {
    console.warn("revalidateCoursePages warning:", err);
  }
}

/**
 * Revalidate module and curriculum pages whenever a module is created,
 * updated, reordered, or deleted.
 */
export function revalidateModulePages() {
  try {
    revalidatePath("/courses");
    revalidatePath("/courses/[slug]", "page");
    revalidatePath("/admin/videos");
    revalidatePath("/admin/courses");
  } catch (err) {
    console.warn("revalidateModulePages warning:", err);
  }
}

/**
 * Revalidate lesson, video streaming and duration pages whenever
 * a lesson is added, updated, reordered, deleted, or duration is saved.
 */
export function revalidateLessonPages() {
  try {
    revalidatePath("/courses");
    revalidatePath("/courses/[slug]", "page");
    revalidatePath("/admin");
    revalidatePath("/admin/videos");
    revalidatePath("/learn/[courseId]", "page");
  } catch (err) {
    console.warn("revalidateLessonPages warning:", err);
  }
}

/**
 * Revalidate payment, enrollment, student management and student dashboard
 * pages immediately whenever an enrollment/payment is approved or rejected.
 */
export function revalidatePaymentPages() {
  try {
    revalidatePath("/admin");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/students");
    revalidatePath("/dashboard");
  } catch (err) {
    console.warn("revalidatePaymentPages warning:", err);
  }
}

/**
 * Revalidate admin privilege pages whenever an admin is added or deleted.
 */
export function revalidateAdminPages() {
  try {
    revalidatePath("/admin");
    revalidatePath("/admin/admins");
  } catch (err) {
    console.warn("revalidateAdminPages warning:", err);
  }
}
