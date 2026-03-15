import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
}
// @supabase/auth-helpers-nextjs bridges this gap:
// createBrowserClient() reads both localStorage + cookies
// createServerClient() reads server cookies properly

// Purpose: Creates a Supabase client that works on the server (Next.js server components, API routes, middleware).

// What it does:

// Reads server-side cookies from Next.js cookies() (not browser localStorage)
// Used in server components (async function Page()), API routes (/api/...), middleware
// Session lives in HTTP cookies passed from browser to server
// Can fetch data before sending HTML to browser (faster, more secure)
