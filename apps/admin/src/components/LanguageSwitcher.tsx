// apps/admin/src/components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
    router.refresh();
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Globe className="w-4 h-4 text-gray-500" />
      <button
        onClick={() => switchLocale('fr')}
        className={cn(
          'px-2 py-1 text-sm font-medium rounded transition-colors',
          locale === 'fr'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale('ar')}
        className={cn(
          'px-2 py-1 text-sm font-medium rounded transition-colors',
          locale === 'ar'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        ع
      </button>
    </div>
  );
};

