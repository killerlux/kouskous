// apps/admin/src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Car, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Topbar } from '@/components/layout/Topbar';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  activeDrivers: number;
  pendingDeposits: number;
  totalRidesToday: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeDrivers: 0,
    pendingDeposits: 0,
    totalRidesToday: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.getDashboardStats();
        // API returns { data: { activeDrivers, pendingDeposits, ... } }
        if (response.data?.data) {
          setStats(response.data.data);
        } else if (response.data) {
          // Fallback if structure is different
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Don't use mock data - show zeros instead
        setStats({
          activeDrivers: 0,
          pendingDeposits: 0,
          totalRidesToday: 0,
          totalRevenue: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards: Array<{
    title: string;
    value: number | string;
    icon: typeof Car;
    color: string;
    bgColor: string;
    badge?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    isMonetary?: boolean;
  }> = [
    {
      title: 'Chauffeurs actifs',
      value: stats.activeDrivers,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Dépôts en attente',
      value: stats.pendingDeposits,
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      badge: stats.pendingDeposits > 0 ? 'warning' : undefined,
    },
    {
      title: 'Courses aujourd\'hui',
      value: stats.totalRidesToday,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Revenus du jour',
      value: formatCurrency(stats.totalRevenue),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isMonetary: true,
    },
  ];

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Vue d'ensemble de la plateforme"
      />
      <main className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="elevated">
                <CardContent className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} variant="elevated">
                  <CardContent className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.isMonetary ? stat.value : stat.value}
                      </p>
                      {stat.badge && (
                        <Badge variant={stat.badge} className="mt-2">
                          Action requise
                        </Badge>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Activité récente" />
          <CardContent>
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune activité récente</p>
              <p className="text-sm text-gray-400 mt-2">
                Les activités récentes apparaîtront ici
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

