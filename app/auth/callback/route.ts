import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || searchParams.get('redirectTo') || '/dashboard';

  // Handle forwarded host for production / reverse proxies (e.g. Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  // Pre-create redirect response so @supabase/ssr attaches cookies directly to the 307 response
  const redirectUrl = new URL(next, baseUrl);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return response;
    }
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session) {
      const user = data.session.user;
      const isSuperAdminEmail = user?.email?.toLowerCase() === 'rakshashri8@gmail.com';
      const metaRole = user?.user_metadata?.role || user?.app_metadata?.role;
      const isAdminUser = isSuperAdminEmail || metaRole === 'admin' || metaRole === 'super_admin';

      // If user is admin/super_admin and intended destination was dashboard/default, redirect to /admin
      if (isAdminUser && (next === '/dashboard' || !searchParams.get('redirectTo'))) {
        response.headers.set('Location', new URL('/admin', baseUrl).toString());
      }

      return response;
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', baseUrl));
}
