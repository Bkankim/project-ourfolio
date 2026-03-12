import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Dashboard: require auth → redirect to /auth
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Auth pages: already logged in → redirect to /dashboard
  if (pathname === "/auth" || pathname === "/login" || pathname === "/signup") {
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth", "/login", "/signup"],
};
