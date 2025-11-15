'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user } = useAuthStore();

  useEffect(() => {
    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'fr';

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // If authenticated but not admin, redirect to login
    if (!isAdmin) {
      router.push(`/${locale}/login`);
      return;
    }
  }, [isAuthenticated, isAdmin, pathname, router]);

  // Show loading or nothing while checking
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

