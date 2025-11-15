'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const isAdminUser = user?.role === 'admin';
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChecking) return;

    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'fr';

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // If authenticated but not admin, redirect to login
    if (!isAdminUser) {
      router.push(`/${locale}/login`);
      return;
    }
  }, [isAuthenticated, isAdminUser, pathname, router, isChecking]);

  // Show loading while checking or if not authenticated
  if (isChecking || !isAuthenticated || !isAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

