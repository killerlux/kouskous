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

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate phone format (Tunisia: +216 XX XXX XXX)
      const phoneRegex = /^\+216\d{8}$/;
      if (!phoneRegex.test(phone)) {
        setError('Numéro de téléphone invalide. Format: +216XXXXXXXX');
        setIsLoading(false);
        return;
      }

      await api.verifyPhone(phone);
      setStep('otp');
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erreur lors de l\'envoi du code. Réessayez.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.exchangeToken(phone, otp);
      const { accessToken, refreshToken, user } = response.data.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        setError('Accès refusé. Seuls les administrateurs peuvent se connecter.');
        setIsLoading(false);
        return;
      }

      // Store tokens and user
      setTokens(accessToken, refreshToken);
      setUser(user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Code OTP invalide. Réessayez.'
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
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                type="tel"
                label="Numéro de téléphone"
                placeholder="+216 XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={error}
                leftIcon={<Phone className="w-5 h-5" />}
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
                Envoyer le code
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Un code de vérification sera envoyé par SMS
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Code envoyé à <strong>{phone}</strong>
                </p>
                <Input
                  type="text"
                  label="Code OTP"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={error}
                  leftIcon={<Lock className="w-5 h-5" />}
                  disabled={isLoading}
                  maxLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={otp.length !== 6}
              >
                Vérifier le code
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
              >
                Modifier le numéro
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

