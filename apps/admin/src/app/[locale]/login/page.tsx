// apps/admin/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate phone format (accepts French +33 or Tunisian +216)
      const phoneRegex = /^\+33\d{9}$|^\+216\d{8}$/;
      if (!phoneRegex.test(phone)) {
        setError('Numéro de téléphone invalide. Format: +33XXXXXXXXX ou +216XXXXXXXX');
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('Veuillez entrer votre mot de passe');
        setIsLoading(false);
        return;
      }

      // Direct admin login (no OTP)
      const response = await api.adminLogin(phone, password);
      // Response: { access_token, refresh_token, expires_in }
      const { access_token, refresh_token } = response.data;

      // Store tokens first
      setTokens(access_token || '', refresh_token || '');

      // Fetch user data
      const userResponse = await api.getMe();
      const sdkUser = userResponse.data;

      // Check if user exists and is admin
      if (!sdkUser.id || !sdkUser.phone_e164 || sdkUser.role !== 'admin') {
        setError('Accès refusé. Seuls les administrateurs peuvent se connecter.');
        setIsLoading(false);
        useAuthStore.getState().logout();
        return;
      }

      // Map SDK user to our User type
      const user = {
        id: sdkUser.id,
        phone_e164: sdkUser.phone_e164,
        role: sdkUser.role as 'admin' | 'driver' | 'rider',
        display_name: sdkUser.display_name ?? undefined,
      };

      // Store user
      setUser(user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(
        error.response?.data?.error || 'Identifiants invalides. Réessayez.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Panneau d'Administration"
          subtitle="Plateforme de gestion des taxis"
        />
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="tel"
              label="Numéro de téléphone"
              placeholder="+33612345678 ou +21612345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={error}
              leftIcon={<Phone className="w-5 h-5" />}
              disabled={isLoading}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              leftIcon={<Lock className="w-5 h-5" />}
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Se connecter
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Accès administrateur uniquement
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

