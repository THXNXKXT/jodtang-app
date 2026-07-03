import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/signup', '/api/line/webhook', '/api/cron'];

function sessionCookie(req: NextRequest): string | undefined {
  const names = ['better-auth.session_token', 'better-auth.session_token.0', 'better-auth.session_token.1', 'better-auth.session_token.2', 'better-auth.session_token.3'];
  return names.map((n) => req.cookies.get(n)?.value).find(Boolean);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isApiAuth = pathname.startsWith('/api/auth');
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/favicon');

  if (isApiAuth || isStatic) return NextResponse.next();

  const sessionToken = sessionCookie(request);

  if (!sessionToken && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (sessionToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
