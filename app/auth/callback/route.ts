import { createClient } from '@/lib/supabase/server';
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

  const supabase = createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(new URL(next, baseUrl));
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let destination = next;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          const role = profile?.role || user.user_metadata?.role;
          if ((role === 'admin' || role === 'super_admin') && (next === '/dashboard' || !searchParams.get('redirectTo'))) {
            destination = '/admin';
          }
        }
      } catch (err) {
        console.warn('Profile role check in callback warning:', err);
      }

      return NextResponse.redirect(new URL(destination, baseUrl));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', baseUrl));
}
