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

  // Handle root path first - redirect to locale-prefixed login
  if (pathname === '/' || pathname === '') {
    const loginUrl = new URL(`/${defaultLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

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

  // Extract locale and path without locale
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = pathParts[0] && locales.includes(pathParts[0] as any) ? pathParts[0] : null;
  const pathnameWithoutLocale = locale ? '/' + pathParts.slice(1).join('/') : pathname;

  // Public routes (without locale prefix)
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some((route) =>
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/')
  );

  // If authenticated admin trying to access login, redirect to dashboard
  if (isAuthenticated && isAdmin && pathnameWithoutLocale === '/login') {
    const currentLocale = locale || defaultLocale;
    const dashboardUrl = new URL(`/${currentLocale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Apply i18n middleware (handles locale redirects)
  const intlResponse = intlMiddleware(request);

  // If i18n middleware already redirected, return it
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute && pathnameWithoutLocale !== '/') {
    const currentLocale = locale || defaultLocale;
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but not admin, deny access
  if (isAuthenticated && !isAdmin && !isPublicRoute) {
    return NextResponse.json(
      { error: 'Accès refusé. Seuls les administrateurs sont autorisés.' },
      { status: 403 }
    );
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

