/**
 * Centralized WhatsApp configuration & link generators
 * WhatsApp number: 919390669648
 * Link format: https://wa.me/91XXXXXXXXXX
 */

export const DEFAULT_WHATSAPP_NUMBER = "919390669648";

export function getCleanWhatsAppNumber(): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  // Ensure digits only (including country code 91), no +, spaces, or hyphens
  const digitsOnly = rawNumber.replace(/\D/g, "");
  return digitsOnly || DEFAULT_WHATSAPP_NUMBER;
}

export const WHATSAPP_MESSAGES = {
  // General enquiry
  general: "Hello! I would like to know more about your courses.",
  // Course enquiry
  course: (courseName: string) =>
    `Hello! I am interested in the ${courseName} course. Please share the details.`,
  // Enrollment assistance
  enrollment: "Hello! I need help with my course enrollment and payment.",
};

export function getWhatsAppLink(message?: string): string {
  const number = getCleanWhatsAppNumber();
  if (!message) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
