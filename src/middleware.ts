// Runs before a page renders. Sends logged-out users to /login and
// logged-in users away from /login, based on the token cookie.

import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/session";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loggedIn = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (pathname.startsWith("/products") && !loggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && loggedIn) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(loggedIn ? "/products" : "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/products/:path*"],
};
