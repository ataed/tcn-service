import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // 🛑 PART 1: ADMIN & LOGIN (The "Manual Exclude" from V1)
  // ============================================================
  // We strictly follow your V1 logic: If it's admin/login, SKIP i18n.
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    // INSTEAD of just returning next(), we run the Security Check here.

    // A. Setup Response
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    // B. Setup Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // C. Get User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // D. Security Rules

    // 1. Block access to /admin if not logged in
    if (pathname.startsWith("/admin") && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Block access if role is not admin (Optional: Comment out if testing with normal user)
    if (pathname.startsWith("/admin") && user) {
      const userRole = user.user_metadata?.role;
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 3. If on /login but already logged in -> Go to Dashboard
    if (pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return response;
  }

  // ============================================================
  // 🌍 PART 2: EVERYTHING ELSE (Run i18n)
  // ============================================================
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
  // "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
};
