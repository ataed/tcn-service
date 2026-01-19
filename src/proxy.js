import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  // 1. Setup the response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Create Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Get the User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Define your Admin Route Pattern
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // --- SECURITY LOGIC ---

  // CHECK 1: If trying to access Admin but NOT logged in -> Go to Login
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CHECK 2: If logged in, but ROLE is NOT 'admin' -> Go to Home (or Error)
  // This assumes you added { "role": "admin" } to your user's metadata in Supabase
  if (isAdminRoute && user) {
    const userRole = user.user_metadata?.role;

    if (userRole !== "admin") {
      // User is logged in, but not an admin. Kick them out.
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // CHECK 3: If already logged in & is Admin, but tries to go to Login -> Go to Dashboard
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
