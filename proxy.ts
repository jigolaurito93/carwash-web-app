import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// middleware.ts should now be called proxy.ts because of Next.js 16 (Canary)
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update the request cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );

          // IMPORTANT: Create a new response to ensure cookies are attached
          supabaseResponse = NextResponse.next({
            request,
          });

          // Update the response cookies
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
