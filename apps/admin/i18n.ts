// apps/admin/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is a valid string, fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  
  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

