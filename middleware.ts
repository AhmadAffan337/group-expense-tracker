import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  // Refresh session if expired, and get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no active session and the user is trying to access a protected route, redirect to /login
  if (!session && req.nextUrl.pathname.startsWith("/profile")) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return res; // allow request to continue
}

// Only run this middleware on specific routes (to avoid unnecessary work on every request)
export const config = {
  matcher: ["/profile"], // apply to profile page (and sub-routes under /profile if any)
};
