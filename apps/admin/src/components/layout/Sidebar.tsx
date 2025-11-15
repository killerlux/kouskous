// apps/admin/src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Car,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Dépôts en attente',
    href: '/deposits',
    icon: FileText,
  },
  {
    label: 'Chauffeurs',
    href: '/drivers',
    icon: Car,
  },
  {
    label: 'Utilisateurs',
    href: '/users',
    icon: Users,
  },
  {
    label: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    const locale = pathname.split('/')[1] || 'fr';
    window.location.href = `/${locale}/login`;
  };

  // Get locale from pathname
  const locale = pathname.split('/')[1] || 'fr';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-700 text-white flex flex-col shadow-xl z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-primary-600">
        <h1 className="text-2xl font-bold text-white">Taxi Admin</h1>
        <p className="text-sm text-primary-200 mt-1">Plateforme de gestion</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Check if current path matches (with or without locale)
          const itemPathWithLocale = `/${locale}${item.href}`;
          const isActive = pathname === itemPathWithLocale || pathname.endsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={itemPathWithLocale}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-white text-primary-700 font-semibold shadow-md'
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-primary-600">
        <div className="px-4 py-3 mb-2 rounded-lg bg-primary-800">
          <p className="text-sm font-medium text-white">{user?.display_name || 'Administrateur'}</p>
          <p className="text-xs text-primary-300 mt-0.5">{user?.phone_e164}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-primary-100 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

