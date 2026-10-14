export function getAuthRedirectOrigin(): string {
  if (typeof window !== "undefined") {
    // If testing on localhost, preserve localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return window.location.origin;
    }
    // If on a Vercel preview/deployment domain (*-my-mini-project.vercel.app),
    // force the public production domain to avoid triggering Vercel Authentication (SSO protection)
    if (window.location.origin.includes("-my-mini-project.vercel.app")) {
      return "https://edtech-eight-chi.vercel.app";
    }
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://edtech-eight-chi.vercel.app";
}
