import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 *
 * NEVER import this file into a Client Component ('use client') or any
 * code that ships to the browser. It reads SUPABASE_SERVICE_ROLE_KEY,
 * which must NOT be prefixed with NEXT_PUBLIC_ and must only live in
 * server environment variables (.env.local, host's env settings).
 *
 * Only call this from Route Handlers / Server Actions that have already
 * verified the caller's identity and permissions using their own
 * session (see app/api/admin/users/route.ts for the pattern).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}