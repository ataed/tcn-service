import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  // 🛡️ 1. THE PRIORITY BYPASS
  // This detects Next.js 16 system files, preloads, and optimized images.
  // It returns a clean response immediately, fixing the "Provisional Headers" hang.
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/static/") ||
    pathname.match(/\.(webp|png|jpg|jpeg|svg|gif|ico|woff2?)$/) ||
    searchParams.has("url") // Specifically targets /_next/image optimization
  ) {
    return NextResponse.next();
  }

  // 2. The CSP Header (Compact single-line string to avoid parsing errors)
  const cspHeader =
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://tudfxgqctzldwicshnfu.supabase.co; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' blob: data: https: http: https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com https://server.arcgisonline.com https://*.basemaps.cartocdn.com; font-src 'self' data: https: http:; connect-src 'self' https://*.supabase.co https://server.arcgisonline.com https://*.basemaps.cartocdn.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';";

  // --- PART 1: ADMIN & LOGIN (Supabase Auth Logic) ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    let response = NextResponse.next();

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
            response = NextResponse.next();
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protection logic
    if (pathname.startsWith("/admin") && !user)
      return NextResponse.redirect(new URL("/login", request.url));
    if (pathname.startsWith("/admin") && user?.user_metadata?.role !== "admin")
      return NextResponse.redirect(new URL("/", request.url));
    if (pathname === "/login" && user)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));

    // Apply CSP only to the actual HTML page
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  // --- PART 2: i18n ROUTING (Everything else) ---
  const i18nResponse = handleI18nRouting(request);

  // Apply CSP to localized pages
  i18nResponse.headers.set("Content-Security-Policy", cspHeader);
  return i18nResponse;
}

export const config = {
  // Broad matcher that handles all pages while excluding API and internal static paths
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
