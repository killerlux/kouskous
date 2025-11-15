// apps/admin/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies or localStorage (check via header)
  const authStorage = request.cookies.get('auth-storage')?.value;

  let isAuthenticated = false;
  let isAdmin = false;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      isAuthenticated = parsed.state?.isAuthenticated || false;
      isAdmin = parsed.state?.user?.role === 'admin';
    } catch (e) {
      // Invalid JSON, not authenticated
    }
  }

  // Public routes
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but not admin, deny access
  if (isAuthenticated && !isAdmin && !isPublicRoute) {
    return NextResponse.json(
      { error: 'Accès refusé. Seuls les administrateurs sont autorisés.' },
      { status: 403 }
    );
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && isAdmin && pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

