// apps/admin/src/app/(dashboard)/deposits/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Topbar } from '@/components/layout/Topbar';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Deposit {
  id: string;
  driver_id: string;
  amount_cents: number;
  receipt_url: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  decided_at?: string;
  decided_by?: string;
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPendingDeposits();
      setDeposits(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
      // Mock data for development
      setDeposits([
        {
          id: '1',
          driver_id: 'driver-001',
          amount_cents: 120000,
          receipt_url: 'https://via.placeholder.com/800x600?text=Receipt+1',
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          driver_id: 'driver-002',
          amount_cents: 100000,
          receipt_url: 'https://via.placeholder.com/800x600?text=Receipt+2',
          status: 'pending',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDeposit = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setIsModalOpen(true);
    setActionType(null);
    setNotes('');
  };

  const handleApprove = async () => {
    if (!selectedDeposit) return;

    setIsSubmitting(true);
    try {
      await api.approveDeposit(selectedDeposit.id, notes);
      // Refresh list
      await fetchDeposits();
      setIsModalOpen(false);
      setSelectedDeposit(null);
    } catch (error) {
      console.error('Failed to approve deposit:', error);
      alert('Erreur lors de l\'approbation du dépôt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDeposit || !notes.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.rejectDeposit(selectedDeposit.id, notes);
      // Refresh list
      await fetchDeposits();
      setIsModalOpen(false);
      setSelectedDeposit(null);
    } catch (error) {
      console.error('Failed to reject deposit:', error);
      alert('Erreur lors du rejet du dépôt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Topbar
        title="Dépôts en attente"
        subtitle="Approbation des dépôts La Poste"
      />
      <main className="p-8">
        <Card>
          <CardHeader
            title={`${deposits.length} dépôt(s) en attente`}
            subtitle="Traitement FIFO (Premier arrivé, premier servi)"
          />
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement...</p>
              </div>
            ) : deposits.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun dépôt en attente</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Chauffeur
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Montant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deposits.map((deposit) => (
                      <tr key={deposit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900 font-mono">
                          #{deposit.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {deposit.driver_id}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(deposit.amount_cents)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(deposit.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="warning" dot>
                            En attente
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewDeposit(deposit)}
                          >
                            Examiner
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Deposit Review Modal */}
      {selectedDeposit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDeposit(null);
            setActionType(null);
            setNotes('');
          }}
          title="Examen du dépôt"
          size="xl"
          footer={
            actionType === null ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={() => setActionType('reject')}
                >
                  Rejeter
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => setActionType('approve')}
                >
                  Approuver
                </Button>
              </>
            ) : actionType === 'approve' ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setActionType(null)}
                >
                  Retour
                </Button>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={handleApprove}
                >
                  Confirmer l'approbation
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setActionType(null)}
                >
                  Retour
                </Button>
                <Button
                  variant="danger"
                  isLoading={isSubmitting}
                  onClick={handleReject}
                  disabled={!notes.trim()}
                >
                  Confirmer le rejet
                </Button>
              </>
            )
          }
        >
          {actionType === null ? (
            <div className="space-y-6">
              {/* Deposit Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID du dépôt</p>
                  <p className="font-mono font-semibold">#{selectedDeposit.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chauffeur</p>
                  <p className="font-semibold">{selectedDeposit.driver_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(selectedDeposit.amount_cents)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de soumission</p>
                  <p className="font-semibold">
                    {formatDate(selectedDeposit.created_at)}
                  </p>
                </div>
              </div>

              {/* Receipt Image */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Reçu La Poste</p>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedDeposit.receipt_url}
                    alt="Reçu"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Points de vérification
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Le montant correspond au dépôt déclaré</li>
                  <li>✓ Le reçu est lisible et complet</li>
                  <li>✓ La date est récente</li>
                  <li>✓ Le tampon La Poste est visible</li>
                  <li>✓ Aucun signe de falsification</li>
                </ul>
              </div>
            </div>
          ) : actionType === 'approve' ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">
                  Confirmer l'approbation
                </h4>
                <p className="text-sm text-green-800">
                  Le chauffeur sera débloqué et pourra accepter de nouvelles courses.
                </p>
              </div>
              <Input
                label="Notes (optionnel)"
                placeholder="Ajouter une note interne..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                helperText="Cette note ne sera pas visible par le chauffeur"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">
                  Confirmer le rejet
                </h4>
                <p className="text-sm text-red-800">
                  Le chauffeur restera bloqué et devra soumettre un nouveau reçu valide.
                </p>
              </div>
              <Input
                label="Raison du rejet (obligatoire)"
                placeholder="Ex: Reçu illisible, montant incorrect..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                error={!notes.trim() ? 'Ce champ est obligatoire' : undefined}
                helperText="Cette raison sera visible par le chauffeur"
                required
              />
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

