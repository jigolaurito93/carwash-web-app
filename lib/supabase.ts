import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// @supabase/auth-helpers-nextjs bridges this gap:
// createBrowserClient() reads both localStorage + cookies
// createServerClient() reads server cookies properly

// Purpose: Creates a Supabase client that works in the browser (client-side React components).

// What it does:

// Reads/writes localStorage and cookies in the user's browser
// Used in "use client" components (like your dashboard)
// Powers supabase.auth.getUser(), supabase.from('users').select(), etc. on the frontend
// Session lives in browser storage so it survives page refreshes
