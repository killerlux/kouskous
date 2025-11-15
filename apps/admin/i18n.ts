// apps/admin/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

