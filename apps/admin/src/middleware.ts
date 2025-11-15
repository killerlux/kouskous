// apps/admin/src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '../i18n';

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Get auth token from cookies
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

  // Check if the route is locale-prefixed
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

  // Public routes (without locale prefix)
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute && pathnameWithoutLocale !== '/') {
    const locale = pathname.split('/')[1];
    const loginUrl = new URL(`/${locale}/login`, request.url);
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
  if (isAuthenticated && isAdmin && pathnameWithoutLocale === '/login') {
    const locale = pathname.split('/')[1];
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

