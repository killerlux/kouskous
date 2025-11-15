// apps/admin/src/app/[locale]/(dashboard)/drivers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Car, Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Topbar } from '@/components/layout/Topbar';

export default function DriversPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Topbar
        title="Chauffeurs"
        subtitle="Gestion des chauffeurs de la plateforme"
      />
      <main className="p-8">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Rechercher un chauffeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drivers List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader title="Liste des chauffeurs" />
            <CardContent>
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  Aucun chauffeur trouvé
                </p>
                <p className="text-sm text-gray-400">
                  {searchQuery
                    ? 'Aucun résultat pour votre recherche'
                    : 'Les chauffeurs inscrits apparaîtront ici'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
