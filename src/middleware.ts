import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionToken = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Dashboard: require auth → redirect to /auth
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Public pages: already logged in → redirect to /dashboard
  if (pathname === "/" || pathname === "/auth" || pathname === "/login" || pathname === "/signup") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth", "/login", "/signup"],
};
