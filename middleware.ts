import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Exclude login page and login API endpoint
  if (path === '/admin/login' || path === '/api/admin/login') {
    return NextResponse.next();
  }

  // Guard all Admin UI pages (/admin, /admin/*)
  if (path.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const authHeader = request.headers.get('authorization');

    const isValidSession = Boolean(
      (adminSession && adminSession.length > 10) ||
      (authHeader && authHeader.startsWith('Bearer '))
    );

    if (!isValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Guard all Admin API endpoints (/api/admin/*)
  if (path.startsWith('/api/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const authHeader = request.headers.get('authorization');

    const isValidSession = Boolean(
      (adminSession && adminSession.length > 10) ||
      (authHeader && authHeader.startsWith('Bearer '))
    );

    if (!isValidSession) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin Firebase authentication required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
