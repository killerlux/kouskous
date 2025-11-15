// apps/admin/src/components/layout/Topbar.tsx
'use client';

import { Bell, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="w-64">
            <Input
              type="search"
              placeholder={t('search')}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>


          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

