import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || searchParams.get('redirectTo') || '/dashboard';

  // Handle forwarded host for production / reverse proxies (e.g. Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  const cookieStore = cookies();
  const supabase = createClient();

  const createRedirectWithCookies = (targetUrl: string) => {
    const redirectRes = NextResponse.redirect(targetUrl);
    cookieStore.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value);
    });
    return redirectRes;
  };

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return createRedirectWithCookies(`${baseUrl}${next}`);
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Sync profile entry for OAuth user if missing
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Student',
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: user.user_metadata?.role || 'student',
          }, { onConflict: 'id' });
        }
      } catch (profileErr) {
        console.warn('OAuth profile sync warning:', profileErr);
      }

      return createRedirectWithCookies(`${baseUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`);
}
