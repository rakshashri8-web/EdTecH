import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Canonical production domain enforcement:
  // If a visitor reaches the old project domain (ed-tec-h or any -my-mini-project.vercel.app deployment alias),
  // immediately 308 redirect them to the canonical domain https://edtech-eight-chi.vercel.app
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

  if (
    !isLocal &&
    (host.includes("ed-tec-h") || host.includes("-my-mini-project.vercel.app"))
  ) {
    const canonicalUrl = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      "https://edtech-eight-chi.vercel.app"
    );
    return NextResponse.redirect(canonicalUrl, 308);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Refreshes the session if expired. DO NOT remove auth.getUser()!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const createRedirectResponse = (targetUrl: URL) => {
    const redirectRes = NextResponse.redirect(targetUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectRes;
  };

  // Protected routes for authenticated users
  const protectedRoutes = ['/dashboard', '/completed', '/learn', '/payment', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return createRedirectResponse(url);
  }

  // Auth routes: redirect if already logged in
  if ((pathname === '/login' || pathname === '/signup') && user) {
    const isSuperAdminEmail = user.email?.toLowerCase() === 'rakshashri8@gmail.com';
    const role = (user.user_metadata?.role as string) || (user.app_metadata?.role as string);
    const isAdmin = isSuperAdminEmail || role === 'admin' || role === 'super_admin';
    url.pathname = isAdmin ? '/admin' : '/dashboard';
    return createRedirectResponse(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
