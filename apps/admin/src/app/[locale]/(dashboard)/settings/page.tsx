// apps/admin/src/app/[locale]/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Topbar } from '@/components/layout/Topbar';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert('Paramètres enregistrés avec succès');
    }, 1000);
  };

  return (
    <>
      <Topbar
        title="Paramètres"
        subtitle="Configuration de la plateforme"
      />
      <main className="p-8">
        <div className="max-w-4xl space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader title="Paramètres généraux" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la plateforme
                </label>
                <Input
                  type="text"
                  placeholder="Taxi Platform"
                  defaultValue="Taxi Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <Input
                  type="email"
                  placeholder="contact@taxi-platform.tn"
                  defaultValue="contact@taxi-platform.tn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone de contact
                </label>
                <Input
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  defaultValue="+216 XX XXX XXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader title="Notifications" />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Notifications par email
                  </p>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications par email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Notifications SMS
                  </p>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications par SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader title="Sécurité" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée de session (minutes)
                </label>
                <Input
                  type="number"
                  placeholder="15"
                  defaultValue="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tentatives de connexion max
                </label>
                <Input
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader title="Localisation" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue par défaut
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" disabled>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuseau horaire
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="Africa/Tunis">Africa/Tunis (GMT+1)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card>
            <CardHeader title="Système" />
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">Version:</span> 1.1.0
                </p>
                <p>
                  <span className="font-medium">Dernière mise à jour:</span> {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Enregistrer les paramètres
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

