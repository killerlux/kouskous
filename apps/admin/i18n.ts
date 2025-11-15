// apps/admin/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is a valid string (never undefined in practice)
  const validLocale = (locale as Locale) || defaultLocale;
  
  return {
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});

