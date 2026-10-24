export function getAuthRedirectOrigin(): string {
  if (typeof window !== "undefined") {
    // If testing on localhost, preserve localhost origin with port
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return window.location.origin;
    }
  }
  // Everywhere else (including production and any deployment alias), use canonical production domain
  return process.env.NEXT_PUBLIC_SITE_URL || "https://edtech-eight-chi.vercel.app";
}
