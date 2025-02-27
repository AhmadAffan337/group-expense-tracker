import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    // If there's a code in the query, exchange it for a session (login)
    await supabase.auth.exchangeCodeForSession(code);
  }
  // After exchanging code (or if no code), redirect to profile or home
  return NextResponse.redirect(new URL("/profile", request.url));
}
