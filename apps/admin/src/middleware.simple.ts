// Simplified middleware - only handles i18n, auth handled client-side
// Use this if you're experiencing redirect loops

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '../i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
  }

  // Let i18n middleware handle everything else
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

