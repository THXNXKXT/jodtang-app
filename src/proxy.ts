import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/api/line/webhook", "/api/cron"];

function sessionCookie(req: NextRequest): string | undefined {
  const suffixes = ["", ".0", ".1", ".2", ".3"];
  const secureNames = suffixes.map((s) => `__Secure-better-auth.session_token${s}`);
  const plainNames = suffixes.map((s) => `better-auth.session_token${s}`);
  return [...secureNames, ...plainNames].map((n) => req.cookies.get(n)?.value).find(Boolean);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // ponytail: "/" is exact-match only — startsWith("/") matches everything
  const isPublic = publicRoutes.some((r) => (r === "/" ? pathname === "/" : pathname.startsWith(r)));
  const isApiAuth = pathname.startsWith("/api/auth");
  const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isApiAuth || isStatic) return NextResponse.next();

  const sessionToken = sessionCookie(request);

  if (!sessionToken && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (sessionToken && isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // ponytail: exclude _next, static, PWA artifacts, public files from auth guard
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icon.svg|apple-icon.png|robots.txt).*)"],
};
