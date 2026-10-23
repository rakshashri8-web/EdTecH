import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

  if (typeof window === 'undefined') {
    return createBrowserClient(url, key);
  }

  if (!client) {
    client = createBrowserClient(url, key, {
      isSingleton: true,
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365, // 1 year session persistence
        sameSite: 'lax',
        path: '/',
        secure: window.location.protocol === 'https:',
      },
    });
  }

  return client;
}
