'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorCard } from '@/components/monitor-card';
import { MonitorForm } from '@/components/monitor-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { Monitor, CreateMonitorInput } from '@/types/monitor';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | undefined>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadMonitors();
    }
  }, [user]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadMonitors();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  const loadMonitors = async () => {
    try {
      const response = await api.get('/monitors');
      const monitorsData = response.data.data;

      // Buscar status e stats de cada monitor
      const monitorsWithStatus = await Promise.all(
        monitorsData.map(async (monitor: Monitor) => {
          try {
            const [statusRes, statsRes] = await Promise.all([
              api.get(`/monitors/${monitor.id}/status`),
              api.get(`/monitors/${monitor.id}/stats`),
            ]);

            return {
              ...monitor,
              currentStatus: statusRes.data.data.status,
              stats: statsRes.data.data,
            };
          } catch (error) {
            return {
              ...monitor,
              currentStatus: 'UNKNOWN',
            };
          }
        })
      );

      setMonitors(monitorsWithStatus);
    } catch (error) {
      console.error('Erro ao carregar monitores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMonitor = async (data: CreateMonitorInput) => {
    await api.post('/monitors', data);
    setShowCreateModal(false);
    loadMonitors();
  };

  const handleUpdateMonitor = async (data: CreateMonitorInput) => {
    if (!editingMonitor) return;
    await api.put(`/monitors/${editingMonitor.id}`, data);
    setEditingMonitor(undefined);
    loadMonitors();
  };

  const handleDeleteMonitor = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este monitor?')) return;
    try {
      await api.delete(`/monitors/${id}`);
      loadMonitors();
    } catch (error) {
      console.error('Erro ao deletar monitor:', error);
    }
  };

  const handleToggleMonitor = async (id: string) => {
    try {
      await api.patch(`/monitors/${id}/toggle`);
      loadMonitors();
    } catch (error) {
      console.error('Erro ao alternar monitor:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeMonitors = monitors.filter((m) => m.isActive);
  const upMonitors = monitors.filter((m) => m.currentStatus === 'UP');
  const downMonitors = monitors.filter((m) => m.currentStatus === 'DOWN');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="ghost">
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold">Bem-vindo, {user.name}!</h2>
            <p className="text-muted-foreground">
              Plano: {user.subscription?.plan || 'FREE'} • {monitors.length}/{
                user.subscription?.plan === 'STARTER' ? '10' :
                user.subscription?.plan === 'PRO' ? '30' :
                user.subscription?.plan === 'BUSINESS' ? '50' : '3'
              } monitores
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total de Monitores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monitors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">UP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {upMonitors.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">DOWN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {downMonitors.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {activeMonitors.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monitors Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seus Monitores</CardTitle>
                  <CardDescription>
                    Gerencie e acompanhe seus monitores de uptime
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  + Novo Monitor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {monitors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem monitores configurados
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Criar Primeiro Monitor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {monitors.map((monitor) => (
                    <MonitorCard
                      key={monitor.id}
                      monitor={monitor}
                      onEdit={setEditingMonitor}
                      onDelete={handleDeleteMonitor}
                      onToggle={handleToggleMonitor}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Monitor</DialogTitle>
            <DialogDescription>
              Configure um novo monitor para acompanhar seu site ou API
            </DialogDescription>
          </DialogHeader>
          <MonitorForm
            onSubmit={handleCreateMonitor}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingMonitor} onOpenChange={() => setEditingMonitor(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Monitor</DialogTitle>
            <DialogDescription>
              Atualize as configurações do seu monitor
            </DialogDescription>
          </DialogHeader>
          <MonitorForm
            monitor={editingMonitor}
            onSubmit={handleUpdateMonitor}
            onCancel={() => setEditingMonitor(undefined)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}