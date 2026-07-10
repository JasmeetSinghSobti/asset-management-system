import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Reads your project URL + anon key from env vars.
// Add these to .env.local:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

// IMPORTANT: cached at module scope so every call to createClient()
// across the app returns the exact same instance. Creating a fresh
// client per component/render means each one has to independently
// re-read the session from cookies, and that read is asynchronous —
// so the very first query fired right after creation can go out
// before the session has loaded, hitting RLS-protected tables as an
// unauthenticated request (auth.uid() = null) and silently returning
// zero rows instead of the expected data.
let client: SupabaseClient | undefined;

export function createClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    throw new Error(
      `Missing Supabase env vars: ${!url ? "NEXT_PUBLIC_SUPABASE_URL " : ""}${
        !anonKey ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" : ""
      }`.trim() +
        ". Add them to .env.local at your project root and restart the dev server."
    );
  }

  client = createBrowserClient(url, anonKey);
  return client;
}