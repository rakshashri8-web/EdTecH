import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
  const protectedRoutes = ['/dashboard', '/completed', '/learn', '/payment'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return createRedirectResponse(url);
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      url.searchParams.set('redirectTo', '/admin');
      return createRedirectResponse(url);
    }

    let isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
    if (!isAdmin) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          isAdmin = true;
        }
      } catch {
        // Fallback
      }
    }

    if (!isAdmin) {
      url.pathname = '/dashboard';
      return createRedirectResponse(url);
    }
  }

  // Auth routes: redirect if already logged in
  if ((pathname === '/login' || pathname === '/signup') && user) {
    let isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
    if (!isAdmin) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          isAdmin = true;
        }
      } catch {
        // Fallback
      }
    }

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
