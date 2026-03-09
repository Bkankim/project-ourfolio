import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie?.value) {
    const authUrl = new URL("/auth", request.url);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
