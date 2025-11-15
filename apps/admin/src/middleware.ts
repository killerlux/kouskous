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

  // Handle root path - redirect to locale-prefixed login
  if (pathname === '/' || pathname === '') {
    const loginUrl = new URL(`/${defaultLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Let i18n middleware handle locale redirects first
  const intlResponse = intlMiddleware(request);

  // If i18n middleware redirected, return it immediately
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // Now check auth (only if i18n didn't redirect)
  const authStorage = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  let isAdmin = false;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      isAuthenticated = parsed.state?.isAuthenticated || false;
      isAdmin = parsed.state?.user?.role === 'admin';
    } catch (e) {
      // Invalid JSON, ignore
    }
  }

  // Extract locale and path
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = pathParts[0] && locales.includes(pathParts[0] as any) ? pathParts[0] : defaultLocale;
  const pathWithoutLocale = pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : '/';

  // Public routes
  const isLoginPage = pathWithoutLocale === '/login';

  // If authenticated admin on login page, redirect to dashboard
  if (isAuthenticated && isAdmin && isLoginPage) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage && pathWithoutLocale !== '/') {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but not admin, deny
  if (isAuthenticated && !isAdmin && !isLoginPage) {
    return NextResponse.json(
      { error: 'Accès refusé. Seuls les administrateurs sont autorisés.' },
      { status: 403 }
    );
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};

