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
      try {
        const response = await api.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Use mock data for now
        setStats({
          activeDrivers: 47,
          pendingDeposits: 8,
          totalRidesToday: 234,
          totalRevenue: 12450000, // in cents
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
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
        {/* Stats Grid */}
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

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Activité récente" />
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Nouveau dépôt</p>
                  <p className="text-sm text-gray-500">Chauffeur #12345 - 1,200 TND</p>
                </div>
                <Badge variant="warning" dot>
                  En attente
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Vérification complétée</p>
                  <p className="text-sm text-gray-500">Chauffeur #12344</p>
                </div>
                <Badge variant="success" dot>
                  Approuvé
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Nouveau chauffeur</p>
                  <p className="text-sm text-gray-500">Inscription #98765</p>
                </div>
                <Badge variant="info" dot>
                  Nouveau
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

