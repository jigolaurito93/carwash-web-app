import {
  getAdminProfileRole,
  isMasterRole,
  isOnboardingComplete,
  needsPasswordSetup,
} from "@/lib/admin-auth";
import type { Database } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function redirectTo(
  request: NextRequest,
  pathname: string,
  supabaseResponse: NextResponse,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const response = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPath = pathname === "/admin/login";
  const isSetPasswordPath = pathname === "/admin/set-password";
  const isOnboardingPath = pathname === "/admin/onboarding";
  const isInvitePath = pathname === "/admin/invite";
  const isAdminPath = pathname.startsWith("/admin");

  if (!user && isAdminPath && !isLoginPath) {
    return redirectTo(request, "/admin/login", supabaseResponse);
  }

  if (user && isAdminPath) {
    const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;

    if (needsPasswordSetup(appMetadata)) {
      if (!isSetPasswordPath) {
        return redirectTo(request, "/admin/set-password", supabaseResponse);
      }
      return supabaseResponse;
    }

    if (!isOnboardingComplete(appMetadata)) {
      if (!isOnboardingPath) {
        return redirectTo(request, "/admin/onboarding", supabaseResponse);
      }
      return supabaseResponse;
    }

    if (isLoginPath || isSetPasswordPath || isOnboardingPath) {
      return redirectTo(request, "/admin/dashboard", supabaseResponse);
    }

    if (isInvitePath) {
      try {
        const role = await getAdminProfileRole(supabase, user.id);
        if (!isMasterRole(role)) {
          return redirectTo(request, "/admin/dashboard", supabaseResponse);
        }
      } catch {
        return redirectTo(request, "/admin/dashboard", supabaseResponse);
      }
    }
  }

  return supabaseResponse;
}
