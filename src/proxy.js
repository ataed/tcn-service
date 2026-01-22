import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Generate a secure random Nonce for this specific request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 2. Define the CSP (Strict-Dynamic satisfies Mozilla, Nonce fixes the loading hang)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com https://server.arcgisonline.com https://*.basemaps.cartocdn.com;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://server.arcgisonline.com https://*.basemaps.cartocdn.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // 3. Set the Nonce in Request Headers so Next.js can find it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // --- PART 1: ADMIN & LOGIN (Supabase Auth Logic) ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    let response = NextResponse.next({
      request: { headers: requestHeaders }, // Pass the new headers here
    });

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
              request: { headers: requestHeaders },
            });
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

    if (pathname.startsWith("/admin") && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/admin") && user) {
      const userRole = user.user_metadata?.role;
      if (userRole !== "admin")
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Apply the CSP to the final response
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  // --- PART 2: EVERYTHING ELSE (i18n Routing) ---
  const i18nResponse = handleI18nRouting(request);
  i18nResponse.headers.set("Content-Security-Policy", cspHeader);
  i18nResponse.headers.set("x-nonce", nonce);
  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
