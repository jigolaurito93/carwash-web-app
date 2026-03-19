import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// middleware.ts should now be called proxy.ts because of Next.js 16 (Canary)
export async function proxy(request: NextRequest) {
  // 1. Creates empty response object that will eventually go to the browser.
  // It's like saying "pass this request through, but let me modify it first."
  let supabaseResponse = NextResponse.next({ request });

  // 2. Creates a server Supabase client but tells it: "Don't use Next.js cookies().
  // Instead, use MY custom cookie handler below."
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // When Supabase asks "What cookies do we have?" → "Here are all cookies from the incoming request"
        getAll() {
          return request.cookies.getAll(); // Read incoming cookies
        },
        // Supabase says "I need to update these cookies" (happens when tokens refresh or login occurs)
        setAll(cookiesToSet) {
          // Update the request object with new cookies. Now if Supabase makes more calls during this middleware run, it sees the updated cookies.
          cookiesToSet.forEach(
            ({ name, value }) => request.cookies.set(name, value), // Update request (for this middleware call)
          );

          // Creates a brand new response using the updated request (with fresh cookies).
          // The old supabaseResponse is thrown away and replaced.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Copy the new cookies onto the response so the browser gets them.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This is vital: It triggers the setAll logic above
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPath = request.nextUrl.pathname === "/admin/login";
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // Redirect if NOT logged in
  if (!user && isAdminPath && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Redirect if ALREADY logged in
  if (user && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
