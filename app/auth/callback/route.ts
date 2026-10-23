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

  const targetUrl = new URL(next, baseUrl);
  const response = NextResponse.redirect(targetUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365, // 1 year session persistence
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              maxAge: options?.maxAge ?? 60 * 60 * 24 * 365,
              sameSite: 'lax',
              path: '/',
              secure: process.env.NODE_ENV === 'production',
            });
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Sync profile entry for OAuth user without overwriting existing roles
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle();

          if (!existingProfile) {
            // New user registration via OAuth
            await supabase.from('profiles').insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
              email: user.email,
              avatar_url: user.user_metadata?.avatar_url || null,
              role: 'student',
            });
          } else {
            // Existing user: never overwrite role. Only update avatar or name if missing.
            await supabase.from('profiles').update({
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
              avatar_url: user.user_metadata?.avatar_url || undefined,
            }).eq('id', user.id);
          }

          const userRole = existingProfile?.role || 'student';
          // If admin or super_admin logs in without a specific deep link target, direct to /admin
          if ((userRole === 'admin' || userRole === 'super_admin') && (next === '/dashboard' || !searchParams.get('redirectTo'))) {
            response.headers.set('Location', new URL('/admin', baseUrl).toString());
          }
        }
      } catch (profileErr) {
        console.warn('OAuth profile sync warning:', profileErr);
      }

      return response;
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`);
}
