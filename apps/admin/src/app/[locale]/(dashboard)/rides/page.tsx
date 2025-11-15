// apps/admin/src/app/[locale]/(dashboard)/rides/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Search, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Topbar } from '@/components/layout/Topbar';
import { formatCurrency, formatDate } from '@/lib/utils';

type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

interface Ride {
  id: string;
  rider_name: string;
  driver_name?: string;
  pickup_address: string;
  dropoff_address: string;
  status: RideStatus;
  fare_cents: number;
  created_at: string;
  completed_at?: string;
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RideStatus | 'all'>('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: RideStatus) => {
    const variants: Record<RideStatus, 'warning' | 'info' | 'success' | 'error' | 'neutral'> = {
      pending: 'warning',
      accepted: 'info',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'error',
    };

    const labels: Record<RideStatus, string> = {
      pending: 'En attente',
      accepted: 'Acceptée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };

    return (
      <Badge variant={variants[status]} dot>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <>
      <Topbar
        title="Courses"
        subtitle="Gestion et suivi des courses"
      />
      <main className="p-8">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Rechercher une course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RideStatus | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptée</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
                <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                  Filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rides List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <Card>
            <CardHeader title="Liste des courses" />
            <CardContent>
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  Aucune course trouvée
                </p>
                <p className="text-sm text-gray-400">
                  {searchQuery
                    ? 'Aucun résultat pour votre recherche'
                    : 'Les courses apparaîtront ici'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader title="Liste des courses" />
            <CardContent>
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Course #{ride.id.slice(0, 8)}
                        </h3>
                        {getStatusBadge(ride.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>{ride.pickup_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>{ride.dropoff_address}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(ride.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">
                              {formatCurrency(ride.fare_cents)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      Voir détails
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

